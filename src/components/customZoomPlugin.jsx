import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';

const customZoomPlugin = () => {
    const store = React.useMemo(() => createStore({}), []);

    return {
        install: (pluginFunctions) => {
            store.update('zoom', pluginFunctions.zoom);
        },
        zoomTo: (scale) => {
            const zoom = store.get('zoom');
            if (zoom) {
                zoom(scale); // Apply the zoom scale
            }
        },
    };
};

export default customZoomPlugin;
