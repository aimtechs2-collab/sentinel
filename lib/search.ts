import { agents, connectors, releases, type SearchResult } from "./dummy-data";
import { QUICK_START_TEMPLATES } from "./quick-start-templates";
import { connectorSlug } from "./connectors";

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  releases.forEach((r) => {
    if (
      r.version.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.team.toLowerCase().includes(q) ||
      r.owner.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    ) {
      results.push({
        id: `rel-${r.id}`,
        type: "release",
        label: `${r.version} — ${r.name}`,
        sublabel: `${r.team} · ${r.status}`,
        href: `/releases/${r.id}`,
      });
    }

    r.tickets.forEach((t) => {
      if (t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)) {
        results.push({
          id: `tkt-${t.id}`,
          type: "ticket",
          label: t.id,
          sublabel: `${t.title} · ${r.version}`,
          href: `/releases/${r.id}`,
        });
      }
    });

    if (r.changeRecord && r.changeRecord.crNumber.toLowerCase().includes(q)) {
      results.push({
        id: `cr-${r.changeRecord.crNumber}`,
        type: "change",
        label: r.changeRecord.crNumber,
        sublabel: `${r.version} · ${r.changeRecord.riskTier} risk · CAB ${r.changeRecord.cabStatus}`,
        href: `/releases/${r.id}`,
      });
    }
  });

  QUICK_START_TEMPLATES.forEach((t) => {
    if (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    ) {
      results.push({
        id: `tpl-${t.id}`,
        type: "change",
        label: t.title,
        sublabel: `Quick Start · ${t.category}`,
        href: t.href,
      });
    }
  });

  agents.forEach((a) => {
    if (a.name.toLowerCase().includes(q) || a.tagline.toLowerCase().includes(q)) {
      results.push({
        id: `ag-${a.id}`,
        type: "ticket",
        label: a.name,
        sublabel: `${a.tagline} · Agent control room`,
        href: "/agents",
      });
    }
  });

  connectors.forEach((c) => {
    if (c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
      results.push({
        id: `conn-${c.id}`,
        type: "ticket",
        label: c.name,
        sublabel: `${c.category} · ${c.status}`,
        href: `/connectors?filter=issues#${connectorSlug(c.name)}`,
      });
    }
  });

  const seen = new Set<string>();
  return results
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .slice(0, 12);
}
