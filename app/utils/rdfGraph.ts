import { Parser, Store, type Quad, type Quad_Object, type Term } from "n3";

const SCHEMA = "https://schema.org/";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

export type RdfGraphNodeType = "person" | "organization" | "product" | "service" | "project" | "website" | "other";

export interface RdfGraphNode {
    id: string;
    label: string;
    type: RdfGraphNodeType;
    description?: string;
    url?: string;
}

export interface RdfGraphLink {
    source: string;
    target: string;
    label: string;
}

export interface SiteSummary {
    name: string;
    description: string;
    counts: { people: number; products: number; services: number; projects: number };
}

const TYPE_BY_CLASS: Record<string, RdfGraphNodeType> = {
    [`${SCHEMA}Person`]: "person",
    [`${SCHEMA}Organization`]: "organization",
    [`${SCHEMA}SoftwareApplication`]: "product",
    [`${SCHEMA}Service`]: "service",
    [`${SCHEMA}CreativeWork`]: "project",
    [`${SCHEMA}WebSite`]: "website",
};

function localName(iri: string): string {
    const withoutFragment = iri.split("#").pop() ?? iri;
    return withoutFragment.split("/").filter(Boolean).pop() ?? iri;
}

function shortPredicate(predicate: string): string {
    if (predicate.startsWith(SCHEMA)) return predicate.slice(SCHEMA.length);
    const separator = Math.max(predicate.lastIndexOf("#"), predicate.lastIndexOf("/"));
    return separator >= 0 ? predicate.slice(separator + 1) : predicate;
}

function objectValue(term: Term): string {
    return term.termType === "Literal" ? term.value : term.id;
}

function parseTurtle(turtle: string): Quad[] {
    const store = new Store();
    store.addQuads(new Parser().parse(turtle));
    return store.getQuads(null, null, null, null);
}

function nodeFor(quads: Quad[], store: { nodes: Map<string, RdfGraphNode> }, id: string): RdfGraphNode {
    const existing = store.nodes.get(id);
    if (existing) return existing;
    const node: RdfGraphNode = { id, label: localName(id), type: "other" };
    for (const quad of quads) {
        if (quad.subject.id !== id) continue;
        const predicate = quad.predicate.id;
        if (predicate === RDF_TYPE && TYPE_BY_CLASS[quad.object.id]) {
            node.type = TYPE_BY_CLASS[quad.object.id];
        } else if (predicate === `${SCHEMA}name`) {
            node.label = objectValue(quad.object);
        } else if (predicate === `${SCHEMA}description`) {
            node.description = objectValue(quad.object);
        }
    }
    // schema:url is the node's own page: prefer it over any sameAs link so
    // same-origin pages open in the split pane rather than an external site.
    for (const predicate of [`${SCHEMA}url`, `${SCHEMA}sameAs`]) {
        const match = quads.find(quad => quad.subject.id === id && quad.predicate.id === predicate);
        if (match) {
            node.url = objectValue(match.object);
            break;
        }
    }
    store.nodes.set(id, node);
    return node;
}

/** Convert Turtle into nodes and links for a network diagram.

 * Only IRI and blank-node objects become nodes; literal values such as names
 * and descriptions are attached to their subject node instead.
 */
export function turtleToGraph(turtle: string): { nodes: RdfGraphNode[]; links: RdfGraphLink[] } {
    const quads = parseTurtle(turtle);
    const nodes = new Map<string, RdfGraphNode>();
    const links: RdfGraphLink[] = [];
    for (const quad of quads) {
        const subject = nodeFor(quads, { nodes }, quad.subject.id);
        const predicate = quad.predicate.id;
        const object: Quad_Object = quad.object;
        if (object.termType === "NamedNode" || object.termType === "BlankNode") {
            const target = nodeFor(quads, { nodes }, object.id);
            links.push({ source: subject.id, target: target.id, label: shortPredicate(predicate) });
        }
    }
    return { nodes: [...nodes.values()], links };
}

/** Extract a concise organization summary from the site's RDF. */
export function turtleToSummary(turtle: string): SiteSummary | null {
    const quads = parseTurtle(turtle);
    const typeCounts: Record<RdfGraphNodeType, number> = { person: 0, organization: 0, product: 0, service: 0, project: 0, website: 0, other: 0 };
    let org: { name?: string; description?: string } | null = null;
    for (const quad of quads) {
        if (quad.predicate.id === RDF_TYPE && TYPE_BY_CLASS[quad.object.id]) {
            typeCounts[TYPE_BY_CLASS[quad.object.id]]++;
        }
        if (quad.subject.id === "https://kurrawong.ai" && quad.predicate.id === `${SCHEMA}name`) {
            org ??= {};
            org.name = quad.object.value;
        }
        if (quad.subject.id === "https://kurrawong.ai" && quad.predicate.id === `${SCHEMA}description`) {
            org ??= {};
            org.description = quad.object.value;
        }
    }
    if (!org?.name || !org.description) return null;
    return {
        name: org.name,
        description: org.description,
        counts: {
            people: typeCounts.person,
            products: typeCounts.product,
            services: typeCounts.service,
            projects: typeCounts.project,
        },
    };
}
