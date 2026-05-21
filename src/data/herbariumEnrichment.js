/**
 * Parts commonly used + non-obvious toxicity notes per catalog entry.
 * Folk and historical context only — not medical advice.
 */

const RESIN_PARTS = ['Tears or lumps — burned on charcoal, ground for incense, or added to blends'];

const CRYSTAL_PARTS = ['Whole stone or tumbled piece — kept on the altar, carried, or placed in layout'];

const CANDLE_PARTS = ['Whole candle — burned for light, focus, or offering in workings'];

const SALT_PARTS = ['Crystals or fine powder — scattered, added to jars, or blended into mixtures'];

/** @type {Record<string, { partsUsed: string[], cautions: string[] }>} */
export const HERBARIUM_ENRICHMENT = {
  lavender: {
    partsUsed: ['Flower buds — dried for sachets, pillows, and strewing'],
    cautions: [],
  },
  rosemary: {
    partsUsed: ['Needle-like leaves and soft stems — dried for cooking, sachets, and smoke bundles'],
    cautions: [],
  },
  sage: {
    partsUsed: ['Leaves — dried for bundles, smudge sticks, and kitchen use'],
    cautions: [],
  },
  basil: {
    partsUsed: ['Leaves — used fresh or dried in kitchen and charm work'],
    cautions: [],
  },
  peppermint: {
    partsUsed: ['Leaves — dried or fresh for teas and cooling preparations'],
    cautions: [],
  },
  spearmint: {
    partsUsed: ['Leaves — milder than peppermint; dried for teas and washes'],
    cautions: [],
  },
  chamomile: {
    partsUsed: ['Flower heads — dried for teas, baths, and gentle preparations'],
    cautions: [],
  },
  mugwort: {
    partsUsed: ['Leaves and flowering tops — dried for dream pillows and smudge bundles'],
    cautions: [],
  },
  thyme: {
    partsUsed: ['Leaves and flowering tops — dried for cooking, teas, and sachets'],
    cautions: [],
  },
  oregano: {
    partsUsed: ['Leaves — dried for kitchen use and aromatic bundles'],
    cautions: [],
  },
  parsley: {
    partsUsed: ['Leaves and stems — fresh or dried as a kitchen herb'],
    cautions: [],
  },
  cilantro: {
    partsUsed: ['Fresh leaves (cilantro) and dried seeds (coriander) — both used in kitchen and charm work'],
    cautions: [],
  },
  dill: {
    partsUsed: ['Seeds and feathery leaves — seeds often carried dried; leaves used fresh or dried'],
    cautions: [],
  },
  fennel: {
    partsUsed: ['Seeds and bulbous base — seeds dried for teas and sachets; stalks used fresh'],
    cautions: [],
  },
  'lemon-balm': {
    partsUsed: ['Leaves — harvested before flowering; dried for teas and sachets'],
    cautions: [],
  },
  calendula: {
    partsUsed: ['Petals — dried for sachets, oils, and ritual baths'],
    cautions: [],
  },
  yarrow: {
    partsUsed: ['Leaves and flowering tops — dried for teas, sachets, and bundles'],
    cautions: [],
  },
  elder: {
    partsUsed: ['Flowers (fresh or dried) and ripe cooked berries — flowers in teas and cordials'],
    cautions: [
      'Flowers and fully ripe cooked berries are traditional; raw berries, leaves, bark, and seeds are toxic',
    ],
  },
  nettle: {
    partsUsed: ['Young leaves — dried or cooked; stinging hairs inactivate with drying or heat'],
    cautions: [],
  },
  dandelion: {
    partsUsed: ['Leaves, roots, and flowers — roots dried for decoctions; leaves and flowers for wine and salads'],
    cautions: [],
  },
  plantain: {
    partsUsed: ['Leaves — fresh poultices or dried for salves and teas'],
    cautions: [],
  },
  mullein: {
    partsUsed: ['Large soft leaves and yellow flower spike — leaves dried for smoke; flowers infused in oil'],
    cautions: ['Leaf fuzz can irritate the throat unless finely strained from smoke or tea'],
  },
  valerian: {
    partsUsed: ['Roots — dried for teas and sachets (noted for strong odor)'],
    cautions: [],
  },
  passionflower: {
    partsUsed: ['Aerial parts and flowers — dried for teas and sachets'],
    cautions: [],
  },
  echinacea: {
    partsUsed: ['Roots and aerial parts — roots most commonly dried for decoctions'],
    cautions: [],
  },
  goldenseal: {
    partsUsed: ['Rhizome and roots — dried for bitter preparations in old apothecary practice'],
    cautions: ['Root is bitter and potent — old dispensary notes reserved it for trained use, not casual kitchen doses'],
  },
  'american-ginseng': {
    partsUsed: ['Root — dried whole or sliced'],
    cautions: [],
  },
  hawthorn: {
    partsUsed: ['Berries, leaves, and flowers — berries dried for teas and cordials'],
    cautions: [],
  },
  cinnamon: {
    partsUsed: ['Inner bark (sticks or quills) and ground powder — used in kitchen, incense, and oils'],
    cautions: [],
  },
  ginger: {
    partsUsed: ['Rhizome — fresh or dried for teas, cooking, and oils'],
    cautions: [],
  },
  turmeric: {
    partsUsed: ['Rhizome — fresh or dried and ground; also used to dye cloth and oils'],
    cautions: [],
  },
  clove: {
    partsUsed: ['Dried flower buds — whole in pomanders or ground for blends'],
    cautions: [],
  },
  'star-anise': {
    partsUsed: ['Star-shaped fruit pods — whole in cooking and incense'],
    cautions: ['True star anise (Illicium verum) only — Japanese star anise (I. anisatum) is toxic and has been sold in mistake'],
  },
  vanilla: {
    partsUsed: ['Cured seed pods — split for extract and whole in jars'],
    cautions: [],
  },
  'bay-laurel': {
    partsUsed: ['Aromatic leaves — dried for cooking, wreaths, and sachets'],
    cautions: ['Sweet bay (Laurus nobilis) only — cherry laurel (Prunus laurocerasus) looks similar and is poisonous'],
  },
  juniper: {
    partsUsed: ['Berries — dried for cooking, gin, and incense blends'],
    cautions: [],
  },
  cedar: {
    partsUsed: ['Wood shavings, tips, and bark — burned or kept in sachets'],
    cautions: [],
  },
  rose: {
    partsUsed: ['Petals and hips — petals fresh or dried; hips dried for teas'],
    cautions: [],
  },
  jasmine: {
    partsUsed: ['Flowers — fresh or dried for sachets and infused oils'],
    cautions: [],
  },
  frankincense: {
    partsUsed: RESIN_PARTS,
    cautions: [],
  },
  myrrh: {
    partsUsed: RESIN_PARTS,
    cautions: [],
  },
  copal: {
    partsUsed: RESIN_PARTS,
    cautions: [],
  },
  sandalwood: {
    partsUsed: ['Heartwood — chips or powder burned as incense or infused in oil'],
    cautions: [],
  },
  'dragons-blood': {
    partsUsed: ['Resin — burned or dissolved in alcohol for ink and varnish'],
    cautions: [],
  },
  'palo-santo': {
    partsUsed: ['Wood — burned as smudge or shavings kept in sachets'],
    cautions: [],
  },
  sweetgrass: {
    partsUsed: ['Dried braids of leaf — burned or kept in bundles'],
    cautions: [],
  },
  rue: {
    partsUsed: ['Leaves — dried sparingly in old sachets'],
    cautions: [
      'All parts toxic in quantity — old herbals reserved it for external use',
      'Sap and leaf juice are phototoxic; can blister skin in sunlight',
    ],
  },
  wormwood: {
    partsUsed: ['Leaves and flowering tops — dried for bitter preparations and incense (historical)'],
    cautions: ['Contains thujone — old apothecary notes warn against heavy or prolonged internal use'],
  },
  horehound: {
    partsUsed: ['Leaves and flowering tops — dried for teas and lozenges in old kitchen use'],
    cautions: [],
  },
  lovage: {
    partsUsed: ['Leaves, stems, and seeds — used like celery in kitchen and dried for teas'],
    cautions: [],
  },
  iris: {
    partsUsed: ['Root (orris) — dried and aged for powder, potpourri fixative, and incense'],
    cautions: ['Fresh root and rhizome can cause nausea — orris is used only after long drying in old practice'],
  },
  poppy: {
    partsUsed: ['Petals and seeds — petals for syrups and baths; seeds for baking (Papaver somniferum)'],
    cautions: ['Petals and culinary seed are traditional; scraping pod latex is dangerous and controlled'],
  },
  'clary-sage': {
    partsUsed: ['Leaves and flowering tops — dried for teas and sachets'],
    cautions: [],
  },
  costmary: {
    partsUsed: ['Leaves — dried for sachets and Bible bookmarks in old household use'],
    cautions: [],
  },
  catmint: {
    partsUsed: ['Leaves and flowering tops — dried for cat toys and gentle teas'],
    cautions: [],
  },
  pennyroyal: {
    partsUsed: ['Leaves — historically used in tiny amounts as a flea deterrent'],
    cautions: ['Highly toxic if ingested — especially the essential oil; old herbals warn it can be fatal'],
  },
  betony: {
    partsUsed: ['Leaves and flowering tops — dried for teas and sachets'],
    cautions: [],
  },
  agrimony: {
    partsUsed: ['Aerial parts — dried for teas and yellow dye in old practice'],
    cautions: [],
  },
  tansy: {
    partsUsed: ['Leaves and buttons — dried sparingly in old linen chests'],
    cautions: ['All parts toxic if eaten — historical use was external or as a linen repellent only'],
  },
  southernwood: {
    partsUsed: ['Aromatic leaves — dried for sachets and insect-repellent bundles'],
    cautions: ['Related to wormwood — old herbals caution against internal use'],
  },
  comfrey: {
    partsUsed: ['Leaves — dried for poultices and salves; root also used in old external preparations'],
    cautions: ['Leaves were common externally; root carries pyrrolizidine alkaloids — old and modern notes diverge on internal use'],
  },
  hyssop: {
    partsUsed: ['Leaves and flowering tops — dried for teas and bundles'],
    cautions: [],
  },
  marshmallow: {
    partsUsed: ['Root and leaves — root mucilage for teas; leaves in poultices'],
    cautions: [],
  },
  violet: {
    partsUsed: ['Flowers and leaves — fresh in syrups; leaves dried for teas'],
    cautions: [],
  },
  'red-clover': {
    partsUsed: ['Flower heads — dried for teas and salves'],
    cautions: [],
  },
  burdock: {
    partsUsed: ['Root and young leaves — root dug in first year for kitchen and decoctions'],
    cautions: ['Root and leaves are edible when identified correctly — easily confused with foxglove or belladonna when young'],
  },
  angelica: {
    partsUsed: ['Root, seeds, and stems — candied stems in old kitchen; root and seed dried'],
    cautions: ['Garden angelica (Angelica archangelica) only — some wild lookalikes are phototoxic or toxic'],
  },
  'bee-balm': {
    partsUsed: ['Leaves and flowers — dried for teas (Oswego tea) and sachets'],
    cautions: [],
  },
  licorice: {
    partsUsed: ['Root — dried sticks or cut for teas and decoctions'],
    cautions: [],
  },
  garlic: {
    partsUsed: ['Bulb cloves — fresh or dried for kitchen, vinegar, and charm bottles'],
    cautions: [],
  },
  pine: {
    partsUsed: ['Needles, young tips, and resin — needles in teas and baths; resin as pitch'],
    cautions: ['Some pine relatives (e.g. yew, Norfolk Island pine) are not edible — identify before tea use'],
  },
  oak: {
    partsUsed: ['Bark and galls — bark tannins for dye; galls for ink in old scribe practice'],
    cautions: [],
  },
  willow: {
    partsUsed: ['Bark — stripped from young twigs and dried for bitter decoctions in old notes'],
    cautions: [],
  },
  'milk-thistle': {
    partsUsed: ['Seeds — ground or extracted in traditional bitter preparations'],
    cautions: [],
  },
  'st-johns-wort': {
    partsUsed: ['Flowering tops — harvested at peak bloom and dried for oil and tea'],
    cautions: ['Can cause photosensitivity in some people with regular use — worth knowing if you sun-gather or work outdoors'],
  },
  vervain: {
    partsUsed: ['Aerial parts — harvested before seed set and dried for teas and sachets'],
    cautions: [],
  },
  'high-john': {
    partsUsed: ['Root (High John the Conqueror / Ipomoea purga) — carried whole in traditional charms'],
    cautions: ['Root and seeds are powerful cathartics — poisonous if ingested; kept as curio in most traditions'],
  },
  tobacco: {
    partsUsed: ['Leaves — dried for offerings in some traditions (historical)'],
    cautions: [],
  },
  camphor: {
    partsUsed: ['Crystals — dissolved in oil or burned sparingly'],
    cautions: ['Toxic if ingested — old household notes treated it as external use only'],
  },
  'witches-broom': {
    partsUsed: ['Flowering twigs and tough stems — bundled for besoms; flowers in old dye and charm work'],
    cautions: ['Seeds and concentrated plant matter contain alkaloids — toxic if ingested; twigs were for craft and threshold work, not kitchen use'],
  },
  beeswax: {
    partsUsed: ['Whole blocks or pellets — melted for candles, salves, and seals'],
    cautions: [],
  },
  wax: {
    partsUsed: ['Pellets, flakes, or blocks — melted and poured for candles and moulds'],
    cautions: [],
  },
  tallow: {
    partsUsed: ['Rendered fat — melted for candles and historical salve bases'],
    cautions: [],
  },
  'olive-oil': {
    partsUsed: ['Fixed oil — carrier for infusions, lamp oil, and anointing blends'],
    cautions: [],
  },
  'carrier-oil': {
    partsUsed: ['Neutral fixed oil — dilutes essences and macerates dried herbs'],
    cautions: [],
  },
  alcohol: {
    partsUsed: ['High-proof spirit — menstruum for tinctures, extracts, and perfumes'],
    cautions: [],
  },
  'witch-hazel': {
    partsUsed: ['Distillate of bark and twigs — liquid base and astringent wash'],
    cautions: [],
  },
  'aqua-vitae': {
    partsUsed: ['Rectified spirit — solvent for tinctures and cordials in old dispensary work'],
    cautions: [],
  },
  'spirit-of-wine': {
    partsUsed: ['Nearly anhydrous ethanol — preferred when water would spoil a preparation'],
    cautions: [],
  },
  'aqua-regia': {
    partsUsed: ['Mixed acids — named in metallurgical and alchemical texts only'],
    cautions: ['Corrosive mixture that releases toxic fumes — laboratory reagent, not a household ingredient'],
  },
  'aqua-fortis': {
    partsUsed: ['Strong nitric solution — etching and testing in historical chemistry'],
    cautions: ['Corrosive acid — burns skin and metal; old laboratory use only'],
  },
  'aqua-distillata': {
    partsUsed: ['Distilled water — base for floral waters and simple preparations'],
    cautions: [],
  },
  vinegar: {
    partsUsed: ['Acetic liquid — culinary, cleansing washes, and acid macerations'],
    cautions: [],
  },
  glycerin: {
    partsUsed: ['Thick humectant — added to tinctures and botanical extracts'],
    cautions: [],
  },
  vitriol: {
    partsUsed: ['Metallic sulfate crystals — named in alchemical correspondence, not culinary use'],
    cautions: ['Iron and copper sulfates are toxic if ingested — historical laboratory salts'],
  },
  'sal-ammoniac': {
    partsUsed: ['Volatile salt crystals — sublimation and flux in old chemical texts'],
    cautions: ['Corrosive to lungs if heated without ventilation — laboratory context only'],
  },
  saltpeter: {
    partsUsed: ['Nitre crystals — named in pyrotechnic and preservation lore'],
    cautions: ['Oxidizer — keep away from fuels; historical formulae differ from kitchen use'],
  },
  alum: {
    partsUsed: ['Whole crystals — dissolved for mordants, pickling, and threshold circles'],
    cautions: [],
  },
  quicksilver: {
    partsUsed: ['Elemental mercury — recorded in alchemical texts; rarely stocked today'],
    cautions: ['Elemental mercury is toxic and accumulates in the body — vapour is hazardous; historical reference only'],
  },
  'oil-of-vitriol': {
    partsUsed: ['Concentrated sulfuric acid — named in metallurgical texts; not a culinary ingredient'],
    cautions: ['Highly corrosive — causes severe burns; releases heat when mixed with water; laboratory context only'],
  },
  tartar: {
    partsUsed: ['Fine white crystals — leavening, mordant, and stabilizer in old household formulae'],
    cautions: [],
  },
  lye: {
    partsUsed: ['Caustic alkali — dissolved for soap-making and historical household chemistry'],
    cautions: ['Strong corrosive alkali — burns skin and eyes on contact; never substitute for table salt'],
  },
  'sulfur-powder': {
    partsUsed: ['Fine yellow powder — burned sparingly in banishing work; named in old brimstone lore'],
    cautions: ['Burning sulfur releases choking fumes — use only with strong ventilation'],
  },
};

const CATEGORY_DEFAULTS = {
  herb: {
    partsUsed: ['Leaves and flowering tops — the parts most often gathered and dried in household practice'],
    cautions: [],
  },
  resin: {
    partsUsed: RESIN_PARTS,
    cautions: [],
  },
  crystal: {
    partsUsed: CRYSTAL_PARTS,
    cautions: [],
  },
  candle: {
    partsUsed: CANDLE_PARTS,
    cautions: [],
  },
  oil: {
    partsUsed: ['Oil — for anointing, dressing candles, or blending into carrier oil'],
    cautions: [],
  },
  salt: {
    partsUsed: SALT_PARTS,
    cautions: [],
  },
  powder: {
    partsUsed: ['Fine powder — sprinkled, added to jars, or blended in small amounts'],
    cautions: [],
  },
  jar: {
    partsUsed: ['Whole vessel — for storage, spell jars, and keeping prepared ingredients'],
    cautions: [],
  },
  tool: {
    partsUsed: ['Whole instrument — used in preparation, ritual, and daily practice'],
    cautions: [],
  },
  flower: {
    partsUsed: ['Flowers and petals — fresh or dried for sachets, baths, and display'],
    cautions: [],
  },
  other: {
    partsUsed: ['Whole item — kept on hand as your practice requires'],
    cautions: [],
  },
};

/** Merge enrichment onto a catalog entry; strips legacy magical field. */
export function enrichHerbariumEntry(entry) {
  if (!entry) return null;
  const { magical: _removed, ...base } = entry;
  const extra = HERBARIUM_ENRICHMENT[entry.id] ?? CATEGORY_DEFAULTS[entry.category] ?? CATEGORY_DEFAULTS.other;
  return {
    ...base,
    partsUsed: extra.partsUsed ?? [],
    cautions: extra.cautions ?? [],
  };
}
