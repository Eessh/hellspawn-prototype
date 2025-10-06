import { Color3 } from "@babylonjs/core";

const CAMERA_DEFAULTS = {
    /**
     * Controls horizontal orbit speed.
     * Higher values mean slower orbiting.
     */
    ANGULAR_SENSIBILITY_X: 200,

    /**
     * Controls vertical orbit speed.
     * Higher values mean slower orbiting.
     */
    ANGULAR_SENSIBILITY_Y: 400,

    /**
     * Controls pinch zoom sensitivity on touch devices.
     * Lower values mean more sensitive zooming.
     */
    PINCH_PRECISION: 0.5,

    /**
     * Controls mouse wheel zoom sensitivity.
     * Lower values mean more sensitive zooming.
     */
    WHEEL_PRECISION: 1.3,
    
    /**
     * Controls inertia for horizontal rotation.
     * Lower values mean less inertia.
     */
    INERTIA: 0.5,

    /**
     * Controls panning speed.
     * Higher values mean faster panning.
     */
    PANNING_SENSIBILITY: 200,

    /**
     * Enables or disables automatic rotation behavior.
     * When enabled, the camera will slowly orbit around the target point automatically.
     */
    USE_AUTO_ROTATION_BEHAVIOR: false,

    /**
     * Maximum zoom out distance.
     */
    UPPER_RADIUS_LIMIT: 500,

    /**
     * Minimum zoom in distance.
     */
    LOWER_RADIUS_LIMIT: 2,

    /**
     * Key codes that trigger leftward camera rotation.
     */
    KEYS_LEFT: [37],

    /**
     * Key codes that trigger rightward camera rotation.
     */
    KEYS_RIGHT: [39],

    /**
     * Key codes that trigger upward camera rotation.
     */
    KEYS_UP: [38],

    /**
     * Key codes that trigger downward camera rotation.
     */
    KEYS_DOWN: [40],
} as const;

const INFINITE_GRID_DEFAULTS = {
    /**
     * Frequency of thicker lines.
     */
    MAJOR_UNIT_FREQUENCY: 5,

    /**
     * Visibility of thinner lines.
     */
    MINOR_UNIT_VISIBILITY: 0.4,

    /**
     * Controls the size of a single grid cell, compared to unit.
     */
    GRID_RATIO: 1,

    /**
     * Enable culling while rendering.
     */
    BACK_FACE_CULLING: false,
    
    /**
     * Background color of the grid (should be a dark color, unless you are an idiot).
     */
    MAIN_COLOR: new Color3(0.05, 0.05, 0.05),

    /**
     * Color of grid lines.
     */
    LINE_COLOR: new Color3(0.2, 0.2, 0.2),

    /**
     * Opacity of grid lines.
     */
    OPACITY: 0.9,

    /**
     * X-coordinate of grid's center from the origin.
     */
    POSITION_X: 0.0,

    /**
     * Y-coordinate of grid's center from the origin.
     */
    POSITION_Y: 0.0,
} as const;

export const DEFAULTS = {
    CAMERA: CAMERA_DEFAULTS,
    INFINITE_GRID: INFINITE_GRID_DEFAULTS,
} as const;
