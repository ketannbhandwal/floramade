import { getSupabaseAdmin } from "@/lib/supabase";

const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
const id = () => globalThis.crypto.randomUUID();

function hydrate(table, row) {
  if (!row) return null;
  const doc = { ...clone(row.data), _id: row.id, id: row.id, createdAt: row.created_at, updatedAt: row.updated_at };
  if (table === "orders" && row.user_id) doc.user = row.user_id;
  for (const key of ["addresses", "reviews"]) {
    if (Array.isArray(doc[key])) {
      doc[key] = doc[key].map((entry) => ({ ...entry, _id: entry._id || id() }));
      Object.defineProperty(doc[key], "id", { enumerable: false, value: (entryId) => doc[key].find((entry) => String(entry._id) === String(entryId)) });
    }
  }
  Object.defineProperty(doc, "save", { enumerable: false, value: async () => saveDoc(table, doc) });
  return doc;
}

function rowFromDoc(table, doc) {
  const data = { ...doc };
  delete data._id; delete data.id; delete data.createdAt; delete data.updatedAt; delete data.save;
  const row = { id: String(doc._id || doc.id || id()), data, created_at: doc.createdAt || new Date().toISOString(), updated_at: new Date().toISOString() };
  if (table === "products") row.slug = data.slug || null;
  if (table === "users") row.email = data.email?.toLowerCase() || null;
  if (table === "orders") { row.user_id = String(doc.user || data.user || ""); row.status = data.status || "placed"; }
  if (table === "inquiries") row.status = data.status || "pending";
  return row;
}

async function saveDoc(table, doc) {
  const row = rowFromDoc(table, doc);
  const { data, error } = await getSupabaseAdmin().from(table).upsert(row).select("*").single();
  if (error) throw error;
  Object.assign(doc, hydrate(table, data));
  return doc;
}

function matches(doc, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "$or") return expected.some((part) => matches(doc, part));
    const actual = key === "_id" ? doc._id : doc[key];
    if (expected instanceof RegExp) return expected.test(String(actual || ""));
    if (expected && typeof expected === "object" && !Array.isArray(expected)) {
      return Object.entries(expected).every(([op, value]) => {
        if (op === "$regex") {
          const flags = expected.$options || "";
          return new RegExp(value, flags).test(String(actual || ""));
        }
        if (op === "$ne") return String(actual) !== String(value);
        if (op === "$lt") return new Date(actual).getTime() < new Date(value).getTime();
        if (op === "$lte") return new Date(actual).getTime() <= new Date(value).getTime();
        if (op === "$gt") return new Date(actual).getTime() > new Date(value).getTime();
        if (op === "$gte") return new Date(actual).getTime() >= new Date(value).getTime();
        if (op === "$options") return true;
        return false;
      });
    }
    return String(actual ?? "") === String(expected ?? "");
  });
}

class Query {
  constructor(model, filter, one = false, operation = null) {
    Object.assign(this, { model, filter, one, operation, sortBy: null, max: null, projection: null, population: null });
  }
  sort(value) { this.sortBy = value; return this; }
  limit(value) { this.max = value; return this; }
  lean() { return this; }
  select(value) { this.projection = value; return this; }
  populate(path, fields) { this.population = { path, fields }; return this; }
  async exec() {
    let request = getSupabaseAdmin().from(this.model.table).select("*");
    for (const [key, expected] of Object.entries(this.filter || {})) {
      if (key === "$or" || key === "resetTokenExpiry") continue;
      const column = ({ _id: "id", id: "id", user: "user_id", slug: "slug", email: "email", status: "status", createdAt: "created_at" })[key] || `data->>${key}`;
      if (expected && typeof expected === "object" && !Array.isArray(expected) && !(expected instanceof RegExp)) {
        for (const [operator, value] of Object.entries(expected)) {
          const method = ({ $ne: "neq", $lt: "lt", $lte: "lte", $gt: "gt", $gte: "gte" })[operator];
          if (method && !(key === "resetTokenExpiry")) request = request[method](column, value);
        }
      } else if (expected instanceof RegExp) {
        request = request.ilike(column, `%${expected.source}%`);
      } else {
        request = request.eq(column, expected);
      }
    }
    if (this.sortBy) {
      const [key, direction] = Object.entries(this.sortBy)[0] || [];
      const column = key === "createdAt" ? "created_at" : `data->>${key}`;
      request = request.order(column, { ascending: direction >= 0 });
    }
    if (this.one) request = request.limit(1);
    else if (this.max != null && !Object.keys(this.filter || {}).some((key) => key === "$or")) request = request.limit(this.max);
    const { data, error } = await request;
    if (error) throw error;
    let docs = (data || []).map((row) => hydrate(this.model.table, row)).filter((doc) => matches(doc, this.filter));
    if (this.sortBy && !Object.keys(this.filter || {}).length) {
      const [key, direction] = Object.entries(this.sortBy)[0] || [];
      docs.sort((a, b) => (new Date(a[key]).getTime() - new Date(b[key]).getTime()) * (direction < 0 ? -1 : 1));
    }
    if (this.max != null) docs = docs.slice(0, this.max);
    if (this.operation) {
      const opResult = await this.operation(docs);
      docs = Array.isArray(opResult) ? opResult : (opResult ? [opResult] : []);
    }
    if (this.population?.path === "user") {
      docs = await Promise.all(docs.map(async (doc) => {
        if (!doc?.user) return doc;
        const { data: userRow, error: userError } = await getSupabaseAdmin().from("users").select("*").eq("id", doc.user).maybeSingle();
        if (userError) throw userError;
        doc.user = userRow ? hydrate("users", userRow) : null;
        return doc;
      }));
    }
    if (this.projection) {
      const fields = this.projection.split(/\s+/).filter(Boolean);
      if (fields[0]?.startsWith("-")) docs = docs.map((doc) => { const out = { ...doc }; for (const field of fields) if (field.startsWith("-")) delete out[field.slice(1)]; return out; });
      else docs = docs.map((doc) => Object.fromEntries(["_id", "id", ...fields].filter((key) => doc[key] !== undefined).map((key) => [key, doc[key]])));
    }
    return this.one ? docs[0] || null : docs;
  }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
}

export function createSupabaseModel(table) {
  return {
    table,
    find(filter = {}) { return new Query(this, filter); },
    findOne(filter = {}) { return new Query(this, filter, true); },
    findById(idValue) { return new Query(this, { _id: idValue }, true); },
    findOneAndUpdate(filter, update) {
      return new Query(this, filter, true, async (docs) => {
        const doc = docs[0]; if (!doc) return null;
        Object.assign(doc, clone(update.$set || update)); return saveDoc(table, doc);
      });
    },
    findByIdAndUpdate(idValue, update) { return this.findOneAndUpdate({ _id: idValue }, update); },
    findOneAndDelete(filter) {
      return new Query(this, filter, true, async (docs) => {
        const doc = docs[0]; if (!doc) return null;
        const { error } = await getSupabaseAdmin().from(table).delete().eq("id", doc._id);
        if (error) throw error; return doc;
      });
    },
    async create(input) {
      const doc = { ...clone(input), _id: input._id || id(), createdAt: input.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
      return saveDoc(table, doc);
    },
    async findOneAndUpdateUpsert(filter, input) { return this.findOneAndUpdate(filter, { $set: input }).exec(); },
  };
}
