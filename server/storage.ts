import { users, cards, userCards, trades, type User, type InsertUser, type Card, type InsertCard, type UserCard, type InsertUserCard, type Trade, type InsertTrade } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cards
  getAllCards(page?: number, limit?: number): Promise<{ cards: Card[], total: number }>;
  getCard(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;

  // User Cards
  getUserCards(userId: number): Promise<(UserCard & { card: Card })[]>;
  addUserCard(userCard: InsertUserCard): Promise<UserCard>;
  removeUserCard(userId: number, cardId: number): Promise<boolean>;

  // Trades
  getAllTrades(): Promise<(Trade & { creator: User, offeredCardDetails: Card[], wantedCardDetails: Card[] })[]>;
  getTrade(id: number): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  deleteTrade(id: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cards: Map<number, Card>;
  private userCards: Map<number, UserCard>;
  private trades: Map<number, Trade>;
  private currentUserId: number;
  private currentCardId: number;
  private currentUserCardId: number;
  private currentTradeId: number;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.userCards = new Map();
    this.trades = new Map();
    this.currentUserId = 1;
    this.currentCardId = 1;
    this.currentUserCardId = 1;
    this.currentTradeId = 1;

    // Seed some initial data
    this.seedData();
  }

  private seedData() {
    // Seed some cards
    const sampleCards: Card[] = [
      {
        id: this.currentCardId++,
        name: "Shadow Dragon",
        description: "A mystical dragon with glowing eyes and dark fantasy artwork",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        rarity: "rare",
        set: "Mystic Legends",
        createdAt: new Date(),
      },
      {
        id: this.currentCardId++,
        name: "Cyber Warrior",
        description: "A futuristic robot with metallic armor and glowing circuits",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        rarity: "epic",
        set: "Tech Wars",
        createdAt: new Date(),
      },
      {
        id: this.currentCardId++,
        name: "Forest Guardian",
        description: "A magical forest spirit with ethereal glowing effects",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        rarity: "common",
        set: "Nature's Call",
        createdAt: new Date(),
      },
      {
        id: this.currentCardId++,
        name: "Ancient Wizard",
        description: "A powerful wizard with magical staff and mystical aura",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        rarity: "legendary",
        set: "Spellbound",
        createdAt: new Date(),
      },
    ];

    sampleCards.forEach(card => this.cards.set(card.id, card));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllCards(page = 1, limit = 20): Promise<{ cards: Card[], total: number }> {
    const allCards = Array.from(this.cards.values());
    const total = allCards.length;
    const start = (page - 1) * limit;
    const cards = allCards.slice(start, start + limit);
    return { cards, total };
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = this.currentCardId++;
    const card: Card = { 
      ...insertCard, 
      id, 
      createdAt: new Date(),
      image: insertCard.image || null,
      description: insertCard.description || null
    };
    this.cards.set(id, card);
    return card;
  }

  async getUserCards(userId: number): Promise<(UserCard & { card: Card })[]> {
    const userCardsList = Array.from(this.userCards.values())
      .filter(uc => uc.userId === userId);
    
    return userCardsList.map(uc => ({
      ...uc,
      card: this.cards.get(uc.cardId)!
    })).filter(uc => uc.card);
  }

  async addUserCard(insertUserCard: InsertUserCard): Promise<UserCard> {
    const id = this.currentUserCardId++;
    const userCard: UserCard = { 
      ...insertUserCard, 
      id, 
      quantity: insertUserCard.quantity || 1,
      addedAt: new Date()
    };
    this.userCards.set(id, userCard);
    return userCard;
  }

  async removeUserCard(userId: number, cardId: number): Promise<boolean> {
    const userCard = Array.from(this.userCards.values())
      .find(uc => uc.userId === userId && uc.cardId === cardId);
    
    if (userCard) {
      this.userCards.delete(userCard.id);
      return true;
    }
    return false;
  }

  async getAllTrades(): Promise<(Trade & { creator: User, offeredCardDetails: Card[], wantedCardDetails: Card[] })[]> {
    const allTrades = Array.from(this.trades.values())
      .filter(trade => trade.status === 'open');
    
    return allTrades.map(trade => {
      const creator = this.users.get(trade.creatorId)!;
      const offeredCardDetails = (trade.offeredCards as any[]).map(oc => this.cards.get(oc.cardId)!).filter(Boolean);
      const wantedCardDetails = (trade.wantedCards as any[]).map(wc => this.cards.get(wc.cardId)!).filter(Boolean);
      
      return {
        ...trade,
        creator,
        offeredCardDetails,
        wantedCardDetails
      };
    });
  }

  async getTrade(id: number): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = this.currentTradeId++;
    const trade: Trade = { 
      ...insertTrade, 
      id, 
      status: 'open',
      message: insertTrade.message || null,
      createdAt: new Date()
    };
    this.trades.set(id, trade);
    return trade;
  }

  async deleteTrade(id: number, userId: number): Promise<boolean> {
    const trade = this.trades.get(id);
    if (trade && trade.creatorId === userId) {
      this.trades.delete(id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
