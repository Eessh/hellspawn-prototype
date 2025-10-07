export const Keys = {
  // Letters
  A: 'KeyA',
  B: 'KeyB',
  C: 'KeyC',
  D: 'KeyD',
  E: 'KeyE',
  F: 'KeyF',
  G: 'KeyG',
  H: 'KeyH',
  I: 'KeyI',
  J: 'KeyJ',
  K: 'KeyK',
  L: 'KeyL',
  M: 'KeyM',
  N: 'KeyN',
  O: 'KeyO',
  P: 'KeyP',
  Q: 'KeyQ',
  R: 'KeyR',
  S: 'KeyS',
  T: 'KeyT',
  U: 'KeyU',
  V: 'KeyV',
  W: 'KeyW',
  X: 'KeyX',
  Y: 'KeyY',
  Z: 'KeyZ',
  
  // Numbers
  Num0: 'Digit0',
  Num1: 'Digit1',
  Num2: 'Digit2',
  Num3: 'Digit3',
  Num4: 'Digit4',
  Num5: 'Digit5',
  Num6: 'Digit6',
  Num7: 'Digit7',
  Num8: 'Digit8',
  Num9: 'Digit9',
  
  // Function keys
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  
  // Special keys
  Escape: 'Escape',
  Tab: 'Tab',
  CapsLock: 'CapsLock',
  ShiftLeft: 'ShiftLeft',
  ShiftRight: 'ShiftRight',
  ControlLeft: 'ControlLeft',
  ControlRight: 'ControlRight',
  AltLeft: 'AltLeft',
  AltRight: 'AltRight',
  Space: 'Space',
  Enter: 'Enter',
  Backspace: 'Backspace',
  Delete: 'Delete',
  
  // Arrow keys
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
} as const;

// Type for key codes
export type KeyCode = typeof Keys[keyof typeof Keys];

/**
 * Keyboard manager that tracks key states with type safety
 */
export class KeyboardManager {
  /**
   * Key states map.
   * 
   * Persists key states across frames.
   */
  private readonly keyStates: Map<string, boolean> = new Map();

  /**
   * Keys that were just pressed/released this frame.
   * 
   * Cleared at the end of each frame.
   */
  private readonly keyJustPressed: Map<string, boolean> = new Map();

  /**
   * Keys that were just released this frame.
   * 
   * Cleared at the end of each frame.
   */
  private readonly keyJustReleased: Map<string, boolean> = new Map();

  /**
   * Bound keydown event handler to maintain `this` context.
   * 
   * Binding to `this` in the constructor ensures that `this` refers to the KeyboardManager instance.
   * The same function reference is used when adding and removing event listeners.
   */
  private readonly boundHandleKeyDown: (event: KeyboardEvent) => void;

  /**
   * Bound keyup event handler to maintain `this` context.
   * 
   * Binding to `this` in the constructor ensures that `this` refers to the KeyboardManager instance.
   * The same function reference is used when adding and removing event listeners.
   */
  private readonly boundHandleKeyUp: (event: KeyboardEvent) => void;
  
  constructor() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);
    
    window.addEventListener('keydown', this.boundHandleKeyDown);
    window.addEventListener('keyup', this.boundHandleKeyUp);
  }
  
  private handleKeyDown(event: KeyboardEvent): void {
    const wasPressed = this.keyStates.get(event.code);
    
    if (!wasPressed) {
      this.keyJustPressed.set(event.code, true);
    }
    
    this.keyStates.set(event.code, true);
  }
  
  private handleKeyUp(event: KeyboardEvent): void {
    this.keyStates.set(event.code, false);
    this.keyJustReleased.set(event.code, true);
  }
  
  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(code: KeyCode): boolean {
    return this.keyStates.get(code) ?? false;
  }
  
  /**
   * Check if a key was just pressed this frame
   */
  isKeyJustPressed(code: KeyCode): boolean {
    return this.keyJustPressed.get(code) ?? false;
  }
  
  /**
   * Check if a key was just released this frame
   */
  isKeyJustReleased(code: KeyCode): boolean {
    return this.keyJustReleased.get(code) ?? false;
  }
  
  /**
   * Check if any of the specified keys are pressed
   */
  anyPressed(codes: KeyCode[]): boolean {
    return codes.some(code => this.isKeyPressed(code));
  }
  
  /**
   * Check if all of the specified keys are pressed
   */
  allPressed(codes: KeyCode[]): boolean {
    return codes.every(code => this.isKeyPressed(code));
  }
  
  /**
   * Reset just pressed/released states
   * Call this at the end of each frame
   */
  update(): void {
    this.keyJustPressed.clear();
    this.keyJustReleased.clear();
  }
  
  /**
   * Clean up event listeners
   */
  destroy(): void {
    window.removeEventListener('keydown', this.boundHandleKeyDown);
    window.removeEventListener('keyup', this.boundHandleKeyUp);
    
    this.keyStates.clear();
    this.keyJustPressed.clear();
    this.keyJustReleased.clear();
  }
}