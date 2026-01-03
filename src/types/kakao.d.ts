declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: {
          center: any;
          level: number;
        }) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: {
          position: any;
        }) => any;
        services: {
          Geocoder: new () => {
            addressSearch: (address: string, callback: (result: any[], status: any) => void) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

export {};

