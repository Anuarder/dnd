/**
 * Onboarding utilities for managing first-time user experience
 *
 * Flow:
 * 1. First-time visitor lands on ANY page of the site
 * 2. RootGuard checks if onboarding is completed
 * 3. If not completed, user is immediately redirected to /onboarding/start (regardless of which page they tried to access)
 * 4. User goes through onboarding pages (start -> player/master -> finish)
 * 5. On finish page, onboardingManager.markAsCompleted() is called
 * 6. User is redirected to sign-in or home page
 * 7. On subsequent visits, onboarding is skipped and user can access any page normally
 */

const ONBOARDING_STORAGE_KEY = 'dnd:onboarding_completed';

/**
 * OnboardingManager class manages onboarding state with localStorage caching
 * Reads from localStorage only once during initialization to improve performance
 */
class OnboardingManager {
  private isCompleted: boolean;

  constructor() {
    // Read from localStorage only once during initialization
    this.isCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  }

  /**
   * Check if user has completed onboarding
   * @returns true if onboarding is completed, false otherwise
   */
  hasCompleted(): boolean {
    return this.isCompleted;
  }

  /**
   * Mark onboarding as completed
   * Call this when user finishes the onboarding flow
   */
  markAsCompleted(): void {
    this.isCompleted = true;
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  }

  /**
   * Reset onboarding state (useful for testing or allowing users to re-watch onboarding)
   */
  reset(): void {
    this.isCompleted = false;
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  }
}

// Create and export a singleton instance
const onboardingManager = new OnboardingManager();

export { onboardingManager };

