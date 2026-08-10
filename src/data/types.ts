export interface RaceDef {
  id: string;
  nome: string;
  vidaBase: number;
  forcaBase: number;
  magiaBase: number;
  agilidadeBase: number;
  spriteFrame: number;
  tint: number;
}

export type EnemyTier = 'comum' | 'elite' | 'boss';

export interface EnemyDef {
  id: string;
  nome: string;
  vida: number;
  ataque: number;
  xp: number;
  moedas: number;
  moedasVariancia: number;
  fragmentosSombrios: number;
  spriteFrame: number;
  tint: number;
  tier: EnemyTier;
}

export type ItemType = 'consumivel' | 'arma' | 'armadura';
export type ItemRarity = 'comum' | 'raro' | 'epico' | 'lendario';
export type WeaponType = 'espada' | 'machado' | 'arco' | 'cajado' | 'adaga';
export type ElementType = 'fogo' | 'gelo' | 'veneno' | 'sombrio';

export interface ItemDef {
  id: string;
  nome: string;
  tipo: ItemType;
  raridade: ItemRarity;
  precoMoedas: number;
  vendaMoedas: number;
  spriteFrame: number;
  tint: number;
  efeitos: {
    curaHp?: number;
    bonusForca?: number;
    bonusMagia?: number;
    bonusVidaMax?: number;
    bonusAgilidade?: number;
  };
  slot?: 'arma' | 'armadura';
  tipoArma?: WeaponType;
  elemento?: ElementType;
}

export interface ZoneDef {
  id: string;
  nome: string;
  ordem: number;
  nivelMinimo: number;
  enemyIds: string[];
  corAmbiente: number;
}

export interface InventoryEntry {
  itemId: string;
  quantidade: number;
}

export interface PlayerData {
  nome: string;
  racaId: string;
  vida: number;
  vidaMax: number;
  forca: number;
  magia: number;
  agilidade: number;
  nivel: number;
  xp: number;
  moedas: number;
  fragmentosSombrios: number;
  inventario: InventoryEntry[];
  armaId: string | null;
  armaduraId: string | null;
  zonaAtual: string;
  x: number;
  y: number;
}
