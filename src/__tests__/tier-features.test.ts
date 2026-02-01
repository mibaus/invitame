import { describe, it, expect } from 'vitest';
import { 
  hasFeature, 
  getTierFeatures, 
  meetsMinimumTier, 
  getMinimumTierForFeature,
  getGalleryLimit,
  GALLERY_LIMITS 
} from '@/lib/tier-features';

describe('Tier Features System', () => {
  describe('hasFeature', () => {
    it('Essential tier has basic features', () => {
      expect(hasFeature('essential', 'hero')).toBe(true);
      expect(hasFeature('essential', 'countdown_minimal')).toBe(true);
      expect(hasFeature('essential', 'venue_link')).toBe(true);
      expect(hasFeature('essential', 'gift_text_only')).toBe(true);
      expect(hasFeature('essential', 'rsvp_whatsapp')).toBe(true);
    });

    it('Essential tier does NOT have Pro features', () => {
      expect(hasFeature('essential', 'agenda')).toBe(false);
      expect(hasFeature('essential', 'venue_map_embed')).toBe(false);
      expect(hasFeature('essential', 'background_music')).toBe(false);
      expect(hasFeature('essential', 'rsvp_form')).toBe(false);
      expect(hasFeature('essential', 'dress_code')).toBe(false);
    });

    it('Essential tier does NOT have Premium features', () => {
      expect(hasFeature('essential', 'logistics_guide')).toBe(false);
      expect(hasFeature('essential', 'spotify_playlist')).toBe(false);
      expect(hasFeature('essential', 'guestbook')).toBe(false);
    });

    it('Pro tier has Essential + Pro features', () => {
      // Essential features
      expect(hasFeature('pro', 'hero')).toBe(true);
      expect(hasFeature('pro', 'venue_link')).toBe(true);
      
      // Pro features
      expect(hasFeature('pro', 'agenda')).toBe(true);
      expect(hasFeature('pro', 'venue_map_embed')).toBe(true);
      expect(hasFeature('pro', 'background_music')).toBe(true);
      expect(hasFeature('pro', 'rsvp_form')).toBe(true);
      expect(hasFeature('pro', 'dress_code')).toBe(true);
    });

    it('Pro tier does NOT have Premium features', () => {
      expect(hasFeature('pro', 'logistics_guide')).toBe(false);
      expect(hasFeature('pro', 'spotify_playlist')).toBe(false);
      expect(hasFeature('pro', 'guestbook')).toBe(false);
    });

    it('Premium tier has ALL features', () => {
      // Essential features
      expect(hasFeature('premium', 'hero')).toBe(true);
      expect(hasFeature('premium', 'venue_link')).toBe(true);
      
      // Pro features
      expect(hasFeature('premium', 'agenda')).toBe(true);
      expect(hasFeature('premium', 'background_music')).toBe(true);
      
      // Premium features
      expect(hasFeature('premium', 'logistics_guide')).toBe(true);
      expect(hasFeature('premium', 'spotify_playlist')).toBe(true);
      expect(hasFeature('premium', 'guestbook')).toBe(true);
    });
  });

  describe('getTierFeatures', () => {
    it('returns correct features for each tier', () => {
      const essentialFeatures = getTierFeatures('essential');
      const proFeatures = getTierFeatures('pro');
      const premiumFeatures = getTierFeatures('premium');

      expect(essentialFeatures.length).toBeGreaterThan(0);
      expect(proFeatures.length).toBeGreaterThan(essentialFeatures.length);
      expect(premiumFeatures.length).toBeGreaterThan(proFeatures.length);
    });
  });

  describe('meetsMinimumTier', () => {
    it('Essential meets Essential requirement', () => {
      expect(meetsMinimumTier('essential', 'essential')).toBe(true);
    });

    it('Essential does NOT meet Pro requirement', () => {
      expect(meetsMinimumTier('essential', 'pro')).toBe(false);
    });

    it('Essential does NOT meet Premium requirement', () => {
      expect(meetsMinimumTier('essential', 'premium')).toBe(false);
    });

    it('Pro meets Essential and Pro requirements', () => {
      expect(meetsMinimumTier('pro', 'essential')).toBe(true);
      expect(meetsMinimumTier('pro', 'pro')).toBe(true);
    });

    it('Pro does NOT meet Premium requirement', () => {
      expect(meetsMinimumTier('pro', 'premium')).toBe(false);
    });

    it('Premium meets ALL requirements', () => {
      expect(meetsMinimumTier('premium', 'essential')).toBe(true);
      expect(meetsMinimumTier('premium', 'pro')).toBe(true);
      expect(meetsMinimumTier('premium', 'premium')).toBe(true);
    });
  });

  describe('getMinimumTierForFeature', () => {
    it('hero requires Essential tier', () => {
      expect(getMinimumTierForFeature('hero')).toBe('essential');
    });

    it('agenda requires Pro tier', () => {
      expect(getMinimumTierForFeature('agenda')).toBe('pro');
    });

    it('guestbook requires Premium tier', () => {
      expect(getMinimumTierForFeature('guestbook')).toBe('premium');
    });
  });

  describe('Gallery Limits', () => {
    it('Essential tier allows 1 photo', () => {
      expect(getGalleryLimit('essential')).toBe(1);
      expect(GALLERY_LIMITS.essential).toBe(1);
    });

    it('Pro tier allows 2 photos', () => {
      expect(getGalleryLimit('pro')).toBe(2);
      expect(GALLERY_LIMITS.pro).toBe(2);
    });

    it('Premium tier allows 15 photos', () => {
      expect(getGalleryLimit('premium')).toBe(15);
      expect(GALLERY_LIMITS.premium).toBe(15);
    });
  });
});

describe('FLEX MODE: Tier + Skin Independence', () => {
  it('Features are controlled by tier, not by skin', () => {
    // Simulating: Essential tier should only show Essential features
    // regardless of which skin (classic-elegance, royal-gold, etc.) is used
    
    const essentialTier = 'essential' as const;
    
    // These should work regardless of skin
    expect(hasFeature(essentialTier, 'hero')).toBe(true);
    expect(hasFeature(essentialTier, 'rsvp_whatsapp')).toBe(true);
    
    // These should NOT work even if using a "Pro skin"
    expect(hasFeature(essentialTier, 'agenda')).toBe(false);
    expect(hasFeature(essentialTier, 'rsvp_form')).toBe(false);
  });

  it('Pro tier features work regardless of skin', () => {
    const proTier = 'pro' as const;
    
    // Pro features should be available even on an "Essential skin"
    expect(hasFeature(proTier, 'agenda')).toBe(true);
    expect(hasFeature(proTier, 'venue_map_embed')).toBe(true);
    expect(hasFeature(proTier, 'background_music')).toBe(true);
  });
});
