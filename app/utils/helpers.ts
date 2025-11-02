import type { GraphInputNode, GraphInputLink } from "@unovis/ts";
import { Store, Parser, type Quad_Object, type MimeFormat } from "n3";

export type GraphNode = GraphInputNode & {
    type: "node" | "literal" | "bnode";
    label: string;
};
export type GraphLink = GraphInputLink & {
    // curie?: string;
    label: string;
};
export type GraphData = {
    nodes: GraphNode[];
    links: GraphLink[];
};

function curie(s: string, prefixes: Record<string, string>): string | undefined {
    if (s === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") return "a";
    const prefixMatches = Object.keys(prefixes).filter(p => s.startsWith(prefixes[p]));
    if (prefixMatches.length === 0) {
        return undefined;
    } else {
        // use longest prefix
        const prefix = prefixMatches.reduce((acc, curr) => prefixes[curr].length > prefixes[acc].length ? curr : acc, prefixMatches[0]);
        return `${prefix}:${s.split(prefixes[prefix])[1]}`;
    }
}

export function rdfToChart(s: string, format: string | MimeFormat = "text/turtle"): GraphData {
    const store = new Store();
    const parser = new Parser({ format });
    const p = parser.parse(s);
    store.addQuads(p);
    const prefixes = parser._prefixes;

    const links: GraphLink[] = [];
    const nodeMap: Record<string, GraphNode> = {};

    const nodeTypes: Record<Quad_Object["termType"], GraphNode["type"]> = {
        "Literal": "literal",
        "BlankNode": "bnode",
        "NamedNode": "node",
        "Variable": "node",
    };

    store.forEach(q => {
        nodeMap[q.subject.id] ??= {
            id: q.subject.id,
            type: "node",
            label: q.subject.value,
        };

        nodeMap[q.object.id] ??= {
            id: q.object.id,
            type: nodeTypes[q.object.termType],
            label: q.object.termType === "Literal" ? `"${q.object.value}"` : q.object.value,
        };

        links.push({
            id: q.predicate.id,
            source: q.subject.id,
            target: q.object.id,
            label: curie(q.predicate.value, prefixes) || q.predicate.value,
        });
    }, null, null, null, null);

    const nodes = Object.values(nodeMap).map(v => v);

    return { nodes, links };
}
