// Map geometry: Natural Earth coastlines (world-atlas) projected with d3-geo.
// Results are cached per map so reels that share a map reuse one set of SVG paths.

import { geoEqualEarth, geoGraticule10, geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { FeatureCollection, Feature, Geometry } from 'geojson'
import type { Topology, GeometryCollection } from 'topojson-specification'
import land50 from 'world-atlas/land-50m.json'
import countries110 from 'world-atlas/countries-110m.json'
import type { MapContext } from '../../content/contexts'

export const W = 400
export const H = 260

let landGeo: FeatureCollection | Feature | null = null
let countriesGeo: FeatureCollection | null = null
const land = () => (landGeo ??= feature(land50 as unknown as Topology, (land50 as unknown as Topology).objects.land as GeometryCollection))
const countries = () =>
  (countriesGeo ??= feature(countries110 as unknown as Topology, (countries110 as unknown as Topology).objects.countries as GeometryCollection) as FeatureCollection)

export type ProjectionKind = 'mercator' | 'equalEarth'

export interface BuiltMap {
  land: string
  graticule: string
  project: (lon: number, lat: number) => [number, number]
  highlights: { id: string; d: string; centroid: [number, number] }[]
}

const cache = new Map<string, BuiltMap>()

/** Fits the projection to the context's places, padded to a minimum span. */
function fitted(ctx: MapContext, kind: ProjectionKind): GeoProjection {
  const p = kind === 'equalEarth' ? geoEqualEarth() : geoMercator()
  if (ctx.projectionCompare) {
    // Whole-world comparison: Mercator can't show the poles, so clip it to ±78°.
    const world: Feature<Geometry> = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-179.9, -58], [179.9, -58], [179.9, 78], [-179.9, 78], [-179.9, -58]]] } }
    return kind === 'equalEarth' ? p.fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' }) : p.fitExtent([[8, 8], [W - 8, H - 8]], world)
  }
  const lons = ctx.places.map((q) => q.lon)
  const lats = ctx.places.map((q) => q.lat)
  let [minLon, maxLon] = [Math.min(...lons), Math.max(...lons)]
  let [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)]
  const span = ctx.minSpan ?? 24
  const padLon = Math.max(span - (maxLon - minLon), 0) / 2 + (maxLon - minLon) * 0.18
  const padLat = Math.max(span * 0.62 - (maxLat - minLat), 0) / 2 + (maxLat - minLat) * 0.22
  minLon = Math.max(-179, minLon - padLon)
  maxLon = Math.min(179, maxLon + padLon)
  minLat = Math.max(-70, minLat - padLat)
  maxLat = Math.min(80, maxLat + padLat)
  const box: Feature<Geometry> = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPoint', coordinates: [[minLon, minLat], [maxLon, maxLat], [minLon, maxLat], [maxLon, minLat]] },
  }
  return p.fitExtent([[16, 16], [W - 16, H - 40]], box)
}

export function buildMap(ctx: MapContext, kind: ProjectionKind = 'mercator'): BuiltMap {
  const key = `${kind}:${ctx.places.map((p) => p.id).join(',')}`
  const hit = cache.get(key)
  if (hit) return hit
  const projection = fitted(ctx, kind)
  const path = geoPath(projection)
  const highlights = ctx.projectionCompare
    ? [ctx.projectionCompare.a, ctx.projectionCompare.b].flatMap((c) => {
        const f = countries().features.find((x) => String(x.id) === c.id)
        if (!f) return []
        const centroid = path.centroid(f) as [number, number]
        return [{ id: c.id, d: path(f) ?? '', centroid }]
      })
    : []
  const built: BuiltMap = {
    land: path(land()) ?? '',
    graticule: path(geoGraticule10()) ?? '',
    project: (lon, lat) => (projection([lon, lat]) ?? [W / 2, H / 2]) as [number, number],
    highlights,
  }
  cache.set(key, built)
  return built
}

/** The point the focused place should sit at: centred, a little above the card. */
export const FOCUS_POINT: [number, number] = [W / 2, H * 0.4]
