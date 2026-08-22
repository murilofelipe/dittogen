import { CandidateName } from '../models/index';

export type AvailabilityStatus = 'available' | 'occupied' | 'unknown' | 'error' | 'not_supported';

export interface AvailabilityResult {
  status: AvailabilityStatus;
  providerName: string;
  url?: string;
  details?: string;
  disclaimer?: string;
}

export interface DomainProvider {
  checkDomain(name: string, tld: string): Promise<AvailabilityResult>;
}

export interface SocialProvider {
  checkHandle(name: string, platform: string): Promise<AvailabilityResult>;
}

export interface TrademarkProvider {
  checkTrademark(name: string, region: string): Promise<AvailabilityResult>;
}

export class MockDomainProvider implements DomainProvider {
  async checkDomain(name: string, tld: string): Promise<AvailabilityResult> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const isAvailable = (name.length + tld.length) % 2 === 0;
    
    return {
      status: isAvailable ? 'available' : 'occupied',
      providerName: 'MockDomainProvider',
      url: `https://mock.example.com/buy/${name}.${tld}`
    };
  }
}

export class MockTrademarkProvider implements TrademarkProvider {
  async checkTrademark(name: string, region: string): Promise<AvailabilityResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const hasConflict = name.toLowerCase().includes('a') && name.toLowerCase().includes('o');
    
    return {
      status: hasConflict ? 'occupied' : 'available',
      providerName: 'MockTrademarkProvider',
      details: hasConflict ? 'Possível conflito encontrado.' : 'Nenhum conflito direto encontrado.',
      disclaimer: 'Ausência de resultado em uma busca automatizada não constitui garantia de disponibilidade jurídica da marca.'
    };
  }
}
