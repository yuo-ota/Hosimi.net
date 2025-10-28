interface Window {
	A?: {
		aladin: (
			container: HTMLElement,
			options?: {
				fov?: number;
				target?: string;
				showReticle?: boolean;
				showProjectionControl?: boolean;
				showZoomControl?: boolean;
				showFullscreenControl?: boolean;
				showLayersControl?: boolean;
				showGotoControl?: boolean;
				showFrame?: boolean;
				[key: string]: unknown;
			}
		) => void;
	};
	Typekit?: {
		load: (config: { async: boolean }) => void;
		[key: string]: unknown;
	};
}