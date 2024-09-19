export type Set = {
  baseSetSize: number;
  block?: string;
  booster?: Record<string, BoosterConfig>;
  cards: CardSet[];
  cardsphereSetId?: number;
  code: string;
  codeV3?: string;
  decks?: DeckSet[];
  isForeignOnly?: boolean;
  isFoilOnly: boolean;
  isNonFoilOnly?: boolean;
  isOnlineOnly: boolean;
  isPaperOnly?: boolean;
  isPartialPreview?: boolean;
  keyruneCode: string;
  languages?: string[];
  mcmId?: number;
  mcmIdExtras?: number;
  mcmName?: string;
  mtgoCode?: string;
  name: string;
  parentCode?: string;
  releaseDate: string;
  sealedProduct?: SealedProduct[];
  tcgplayerGroupId?: number;
  tokens: CardToken[];
  tokenSetCode?: string;
  totalSetSize: number;
  translations: Translations;
  type: string;
};

export type CardSet = {
  artist?: string;
  artistIds?: string[];
  asciiName?: string;
  attractionLights?: number[];
  availability: string[];
  boosterTypes?: string[];
  borderColor: string;
  cardParts?: string[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  convertedManaCost: number;
  defense?: string;
  duelDeck?: string;
  edhrecRank?: number;
  edhrecSaltiness?: number;
  faceConvertedManaCost?: number;
  faceFlavorName?: string;
  faceManaValue?: number;
  faceName?: string;
  finishes: string[];
  flavorName?: string;
  flavorText?: string;
  foreignData?: ForeignData[];
  frameEffects?: string[];
  frameVersion: string;
  hand?: string;
  hasAlternativeDeckLimit?: boolean;
  hasContentWarning?: boolean;
  hasFoil: boolean;
  hasNonFoil: boolean;
  identifiers: Identifiers;
  isAlternative?: boolean;
  isFullArt?: boolean;
  isFunny?: boolean;
  isOnlineOnly?: boolean;
  isOversized?: boolean;
  isPromo?: boolean;
  isRebalanced?: boolean;
  isReprint?: boolean;
  isReserved?: boolean;
  isStarter?: boolean;
  isStorySpotlight?: boolean;
  isTextless?: boolean;
  isTimeshifted?: boolean;
  keywords?: string[];
  language: string;
  layout: string;
  leadershipSkills?: LeadershipSkills;
  legalities: Legalities;
  life?: string;
  loyalty?: string;
  manaCost?: string;
  manaValue: number;
  name: string;
  number: string;
  originalPrintings?: string[];
  originalReleaseDate?: string;
  originalText?: string;
  originalType?: string;
  otherFaceIds?: string[];
  power?: string;
  printings?: string[];
  promoTypes?: string[];
  purchaseUrls: PurchaseUrls;
  rarity: string;
  relatedCards?: RelatedCards;
  rebalancedPrintings?: string[];
  rulings?: Rulings[];
  securityStamp?: string;
  setCode: string;
  side?: string;
  signature?: string;
  sourceProducts?: SourceProducts;
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
  variations?: string[];
  watermark?: string;
};