// Mock data for energy tracking
interface BrowsingStats {
  openTabs: number;
  idleTimeMinutes: number;
  activeTimeMinutes: number;
  emailsInInbox: number;
}

interface EnergyMetrics {
  energyUsage: number; // in kWh
  co2Equivalent: number; // in grams
  streak: number;
  totalSaved: number;
}

// Chrome storage data interface
interface StoredMetrics {
  totalTabsOpened: number;
  totalTabsClosed: number;
  idleTime: number;
  activeTime: number;
  lastActiveDate: string;
  streak: number;
  totalSavedCO2: number;
  dailySavings: Record<string, number>;
}

// Conversion constants (mocked values)
const ENERGY_PER_TAB = 0.5; // kWh per tab per day
const ENERGY_PER_IDLE_MINUTE = 0.02; // kWh per minute of idle time
const ENERGY_PER_ACTIVE_MINUTE = 0.05; // kWh per minute of active browsing
const ENERGY_PER_EMAIL = 0.1; // kWh per email stored
const CO2_PER_KWH = 0.5; // kg CO2 per kWh

class EnergyTracker {
  private previousDayData: EnergyMetrics | null = null;
  private streakStartDate: Date | null = null;
  private savedHistory: number[] = [];
  private isExtensionEnvironment: boolean;
  
  constructor() {
    // Check if we're in a Chrome extension environment
    this.isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.storage !== undefined;
    this.loadData();
  }
  
  private loadData(): void {
    if (this.isExtensionEnvironment) {
      // Load from Chrome storage
      chrome.storage.local.get(['metrics'], (data) => {
        if (data.metrics) {
          const storedMetrics = data.metrics as StoredMetrics;
          
          this.previousDayData = {
            energyUsage: this.calculateEnergyFromStoredMetrics(storedMetrics),
            co2Equivalent: this.calculateCO2FromStoredMetrics(storedMetrics),
            streak: storedMetrics.streak,
            totalSaved: storedMetrics.totalSavedCO2
          };
          
          // Load saved history
          this.loadSavedHistory(storedMetrics.dailySavings);
        } else {
          this.loadMockData();
        }
      });
    } else {
      // Load mock data when not in extension environment
      this.loadMockData();
    }
  }
  
  private loadMockData(): void {
    this.previousDayData = {
      energyUsage: Math.random() * 10 + 5,
      co2Equivalent: Math.random() * 10 + 2.5,
      streak: 1,
      totalSaved: Math.random() * 50
    };
    
    this.streakStartDate = new Date();
    this.streakStartDate.setDate(this.streakStartDate.getDate() - 1);
    
    // Mock history of saved CO2
    this.savedHistory = Array.from({ length: 7 }, () => Math.random() * 10);
  }
  
  private loadSavedHistory(dailySavings: Record<string, number>): void {
    // Get the last 7 days of savings
    const today = new Date();
    const savings: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      savings.push(dailySavings[dateStr] || 0);
    }
    
    this.savedHistory = savings;
  }
  
  private calculateEnergyFromStoredMetrics(metrics: StoredMetrics): number {
    // Calculate energy based on stored metrics
    return metrics.totalTabsOpened * 0.1 + 
           metrics.idleTime * ENERGY_PER_IDLE_MINUTE;
  }
  
  private calculateCO2FromStoredMetrics(metrics: StoredMetrics): number {
    // Calculate CO2 based on stored metrics
    const energy = this.calculateEnergyFromStoredMetrics(metrics);
    return energy * CO2_PER_KWH;
  }
  
  public getBrowsingStats(): BrowsingStats {
    if (this.isExtensionEnvironment) {
      // Get real tab count
      // @ts-ignore
      return new Promise<BrowsingStats>((resolve) => {
        chrome.tabs.query({}, (tabs) => {
          chrome.storage.local.get(['metrics'], (data) => {
            const metrics = data.metrics as StoredMetrics || {
              idleTime: 0,
              activeTime: 0,
              totalTabsOpened: 0,
              totalTabsClosed: 0,
              streak: 1,
              totalSavedCO2: 0,
              lastActiveDate: new Date().toISOString().split('T')[0],
              dailySavings: {},
            };
            
            resolve({
              openTabs: tabs.length,
              idleTimeMinutes: metrics.idleTime,
              activeTimeMinutes: metrics.activeTime,
              emailsInInbox: Math.floor(Math.random() * 100) + 10 // Still mocked
            });
          });
        });
      });
    } else {
      // Return mock data
      return {
        openTabs: Math.floor(Math.random() * 15) + 5,
        idleTimeMinutes: Math.floor(Math.random() * 120),
        activeTimeMinutes: Math.floor(Math.random() * 180),
        emailsInInbox: Math.floor(Math.random() * 100) + 10
      };
    }
  }
  
  public async calculateCurrentMetrics(): Promise<EnergyMetrics> {
    const stats = await this.getBrowsingStats();
    
    // Calculate energy usage based on metrics
    const tabEnergy = stats.openTabs * ENERGY_PER_TAB;
    const idleEnergy = stats.idleTimeMinutes * ENERGY_PER_IDLE_MINUTE;
    const activeEnergy = stats.activeTimeMinutes * ENERGY_PER_ACTIVE_MINUTE;
    const emailEnergy = stats.emailsInInbox * ENERGY_PER_EMAIL;
    
    const totalEnergy = tabEnergy + idleEnergy + activeEnergy + emailEnergy;
    const co2 = totalEnergy * CO2_PER_KWH;
    
    let streak = 1;
    let totalSaved = 0;
    
    if (this.isExtensionEnvironment) {
      // Get real streak from storage
      const metricsData = await new Promise<StoredMetrics>((resolve) => {
        chrome.storage.local.get(['metrics'], (data) => {
          resolve(data.metrics as StoredMetrics || {
            streak: 1,
            totalSavedCO2: 0,
            idleTime: 0,
            activeTime: 0,
            totalTabsOpened: 0,
            totalTabsClosed: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            dailySavings: {}
          });
        });
      });
      
      streak = metricsData.streak;
      totalSaved = metricsData.totalSavedCO2;
    } else {
      // Use mock data
      streak = this.previousDayData?.streak || 1;
      totalSaved = this.previousDayData?.totalSaved || 0;
    }
    
    return {
      energyUsage: totalEnergy,
      co2Equivalent: co2,
      streak,
      totalSaved
    };
  }
  
  private calculateStreak(): number {
    // In a real implementation, this would check if actions were taken each day
    return this.previousDayData?.streak || 1;
  }
  
  public async actionTaken(co2Saved: number): Promise<EnergyMetrics> {
    // Update metrics after an eco-action is taken
    let currentMetrics = await this.calculateCurrentMetrics();
    
    if (this.isExtensionEnvironment) {
      // Save to Chrome storage
      chrome.storage.local.get(['metrics'], (data) => {
        const metrics = data.metrics as StoredMetrics || {
          streak: 1,
          totalSavedCO2: 0,
          idleTime: 0,
          activeTime: 0,
          totalTabsOpened: 0,
          totalTabsClosed: 0,
          lastActiveDate: new Date().toISOString().split('T')[0],
          dailySavings: {}
        };
        
        metrics.totalSavedCO2 += co2Saved;
        
        const today = new Date().toISOString().split('T')[0];
        if (!metrics.dailySavings[today]) {
          metrics.dailySavings[today] = 0;
        }
        metrics.dailySavings[today] += co2Saved;
        
        chrome.storage.local.set({ metrics });
      });
    }
    
    // Update the local state regardless of storage
    return {
      ...currentMetrics,
      co2Equivalent: Math.max(0, currentMetrics.co2Equivalent - co2Saved),
      totalSaved: currentMetrics.totalSaved + co2Saved,
      streak: currentMetrics.streak
    };
  }
  
  public async getWeeklySummary(): Promise<{ dates: string[], savings: number[] }> {
    if (this.isExtensionEnvironment) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['metrics'], (data) => {
          const metrics = data.metrics as StoredMetrics;
          
          if (metrics && metrics.dailySavings) {
            this.loadSavedHistory(metrics.dailySavings);
          }
          
          const dates: string[] = [];
          const today = new Date();
          
          // Generate last 7 days dates
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
          }
          
          resolve({
            dates,
            savings: this.savedHistory
          });
        });
      });
    } else {
      // Generate mock weekly summary data
      const dates: string[] = [];
      const today = new Date();
      
      // Generate last 7 days dates
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      
      return {
        dates,
        savings: this.savedHistory
      };
    }
  }
}

export default new EnergyTracker(); 