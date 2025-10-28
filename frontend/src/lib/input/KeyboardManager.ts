export const Keys = {
  // Letters
  A: "KeyA",
  B: "KeyB",
  C: "KeyC",
  D: "KeyD",
  E: "KeyE",
  F: "KeyF",
  G: "KeyG",
  H: "KeyH",
  I: "KeyI",
  J: "KeyJ",
  K: "KeyK",
  L: "KeyL",
  M: "KeyM",
  N: "KeyN",
  O: "KeyO",
  P: "KeyP",
  Q: "KeyQ",
  R: "KeyR",
  S: "KeyS",
  T: "KeyT",
  U: "KeyU",
  V: "KeyV",
  W: "KeyW",
  X: "KeyX",
  Y: "KeyY",
  Z: "KeyZ",

  // Numbers
  Num0: "Digit0",
  Num1: "Digit1",
  Num2: "Digit2",
  Num3: "Digit3",
  Num4: "Digit4",
  Num5: "Digit5",
  Num6: "Digit6",
  Num7: "Digit7",
  Num8: "Digit8",
  Num9: "Digit9",

  // Function keys
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",

  // Special keys
  Escape: "Escape",
  Tab: "Tab",
  CapsLock: "CapsLock",
  ShiftLeft: "ShiftLeft",
  ShiftRight: "ShiftRight",
  ControlLeft: "ControlLeft",
  ControlRight: "ControlRight",
  AltLeft: "AltLeft",
  AltRight: "AltRight",
  Space: "Space",
  Enter: "Enter",
  Backspace: "Backspace",
  Delete: "Delete",

  // Arrow keys
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
} as const;

export type TKeyCode = (typeof Keys)[keyof typeof Keys];

export type TKeybindingCallback = () => void;

export type TKeybinding = {
  keys: TKeyCode[];
  callback: TKeybindingCallback;
};

/**
 * Keyboard manager that tracks key states.
 *
 * Also responsible for managing keybindings, and triggering callbacks.
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
   * Map of keybinding names to their key codes and callbacks.
   */
  private readonly keybindings: Map<string, TKeybinding> = new Map();

  /**
   * Map from key code to set of binding names that include that key.
   *
   * Used to efficiently check which bindings to evaluate when a key event occurs.
   */
  private readonly keyToBindingsMap: Map<string, Set<string>> = new Map();

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

    window.addEventListener("keydown", this.boundHandleKeyDown);
    window.addEventListener("keyup", this.boundHandleKeyUp);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const wasPressed = this.keyStates.get(event.code);

    if (!wasPressed) {
      this.keyJustPressed.set(event.code, true);
    }

    this.keyStates.set(event.code, true);

    if (this.keybindingExists()) {
      event.preventDefault();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keyStates.set(event.code, false);
    this.keyJustReleased.set(event.code, true);
  }

  /**
   * Check if any registered keybinding matches the currently pressed keys.
   * @returns `true` if exists.
   */
  private keybindingExists(): boolean {
    // get all currently pressed keys
    const pressedKeys = new Set<TKeyCode>();

    for (const [code, pressed] of this.keyStates.entries()) {
      if (pressed) {
        pressedKeys.add(code as TKeyCode);
      }
    }

    // check if these exact keys match any registered keybinding
    for (const binding of this.keybindings.values()) {
      if (
        binding.keys.length === pressedKeys.size &&
        binding.keys.every((key) => pressedKeys.has(key))
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(code: TKeyCode): boolean {
    return this.keyStates.get(code) ?? false;
  }

  /**
   * Check if a key was just pressed this frame
   */
  isKeyJustPressed(code: TKeyCode): boolean {
    return this.keyJustPressed.get(code) ?? false;
  }

  /**
   * Check if a key was just released this frame
   */
  isKeyJustReleased(code: TKeyCode): boolean {
    return this.keyJustReleased.get(code) ?? false;
  }

  /**
   * Check if any of the specified keys are pressed
   */
  anyPressed(codes: TKeyCode[]): boolean {
    return codes.some((code) => this.isKeyPressed(code));
  }

  /**
   * Check if all of the specified keys are pressed
   */
  allPressed(codes: TKeyCode[]): boolean {
    return codes.every((code) => this.isKeyPressed(code));
  }

  /**
   * Register a keybinding
   * @param keys array of keys that trigger the binding (order is not important)
   * @param callback The callback to invoke when the keys are pressed
   * @param id An optional ID for the binding
   * @returns The ID of the binding
   */
  registerKeybinding(
    keys: TKeyCode[],
    callback: TKeybindingCallback,
    id?: string
  ): string {
    const bindingId = id ?? `kb_${Math.random().toString(36).substring(2, 9)}`;

    // remove existing binding if it exists
    this.removeKeybinding(bindingId);

    this.keybindings.set(bindingId, { keys: [...keys], callback });

    // map each key to this binding for quick lookup on key events
    keys.forEach((key) => {
      if (!this.keyToBindingsMap.has(key)) {
        this.keyToBindingsMap.set(key, new Set());
      }

      // always exists due to the check above
      this.keyToBindingsMap.get(key)!.add(bindingId);
    });

    return bindingId;
  }

  /**
   * Update an existing keybinding
   * @param id ID of the keybinding to update
   * @param keys New keys for the keybinding
   * @param callback New callback for the keybinding
   * @returns `true` if the keybinding was updated, `false` if it did not exist
   */
  updateKeybinding(
    id: string,
    keys?: TKeyCode[],
    callback?: TKeybindingCallback
  ): boolean {
    const binding = this.keybindings.get(id);

    if (!binding) {
      return false;
    }

    if (keys) {
      // remove from old keys in key to bindings map
      binding.keys.forEach((key) => {
        const bindingsForKey = this.keyToBindingsMap.get(key);

        if (bindingsForKey) {
          bindingsForKey.delete(id);
        }
      });

      // set new keys
      binding.keys = [...keys];

      // update keys in key to bindings map
      keys.forEach((key) => {
        if (!this.keyToBindingsMap.has(key)) {
          this.keyToBindingsMap.set(key, new Set());
        }

        // always exists due to the check above
        this.keyToBindingsMap.get(key)!.add(id);
      });
    }

    if (callback) {
      binding.callback = callback;
    }

    return true;
  }

  /**
   * Remove a keybinding
   * @param id ID of the keybinding to remove
   * @returns `true` if the keybinding was removed, `false` if it did not exist
   */
  removeKeybinding(id: string): boolean {
    const binding = this.keybindings.get(id);

    if (!binding) {
      return false;
    }

    // remove from key to bindings map
    binding.keys.forEach((key) => {
      const bindingsForKey = this.keyToBindingsMap.get(key);

      if (bindingsForKey) {
        bindingsForKey.delete(id);
      }
    });

    return this.keybindings.delete(id);
  }

  /**
   * Check all registered keybindings, and trigger callbacks for matches
   */
  private checkKeybindings(): void {
    // keys pressed this frame
    const justPressedKeys: TKeyCode[] = [];

    for (const [code, justPressed] of this.keyJustPressed.entries()) {
      if (justPressed) {
        justPressedKeys.push(code as TKeyCode);
      }
    }

    // early return if no keys were just pressed
    if (justPressedKeys.length === 0) {
      return;
    }

    // pressed keys (may not be from this frame)
    const pressedKeys = new Set<TKeyCode>();

    for (const [code, pressed] of this.keyStates.entries()) {
      if (pressed) {
        pressedKeys.add(code as TKeyCode);
      }
    }

    // check if any of keys pressed this frame are part of any bindings
    for (const justPressedKey of justPressedKeys) {
      // bindings that include this key
      const bindingsForKey = this.keyToBindingsMap.get(justPressedKey);

      if (!bindingsForKey || bindingsForKey.size === 0) {
        continue;
      }

      // check each binding to see if all its keys are pressed
      for (const bindingId of bindingsForKey) {
        const binding = this.keybindings.get(bindingId);

        if (!binding) {
          continue;
        }

        // if all keys for this binding are pressed, invoke the callback
        const allKeysPressed = binding.keys.every((key) =>
          pressedKeys.has(key)
        );

        if (allKeysPressed) {
          binding.callback();
        }
      }
    }
  }

  /**
   * Reset just pressed/released states
   * Call this at the end of each frame
   */
  update(): void {
    this.checkKeybindings();

    this.keyJustPressed.clear();
    this.keyJustReleased.clear();
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    window.removeEventListener("keydown", this.boundHandleKeyDown);
    window.removeEventListener("keyup", this.boundHandleKeyUp);

    this.keyStates.clear();
    this.keyJustPressed.clear();
    this.keyJustReleased.clear();
    this.keybindings.clear();
    this.keyToBindingsMap.clear();
  }
}
