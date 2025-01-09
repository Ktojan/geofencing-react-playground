import { useEffect, useState } from 'react';
import { Input, AutoComplete } from 'antd';
import type { AutoCompleteProps } from 'antd';
import useOSM_Nominatim, { useDebounce } from '../hooks/useOSM_Nominatim';
import { useMap } from 'react-leaflet';
import * as L from "leaflet";
import { convertedToGeojsonObject } from '../util/Functions';
import { Point, LineString, Polygon, MultiPolygon } from 'geojson'
import { NominatimResult } from '../constants/types';
// based on https://github.com/rallets/react-open-street-map-nominatim

export type AddressGeojson = Point | LineString | Polygon | MultiPolygon;

export default function AddressSearch({ setSelectedBySearchObject }) {
  const [address, setAddress] = useState<string | undefined>('');
  const [osmQuery, setOsmQuery] = useState<string | undefined>(undefined);
  const [suggestionsResult, setSuggestionsResult] = useState<AutoCompleteProps[]>([]);
  const mapInstance: L.Map = useMap();
  const config = {
    minSearchCharsLength: 5,
    objectsToDraw: ["Polygon","LineString","Rectangle"],
    countryCodes: ['de'], // comma-separated list of "ISO 3166-1alpha2" country codes.
    languages: ['de']
  }
  // NB: do not reduce to less than 1 second https://operations.osmfoundation.org/policies/nominatim/
  // It says "No heavy uses (an absolute maximum of 1 request per second)."
  const debouncedAddress: string | undefined = useDebounce<string | undefined>(address, 1000);
  
  const [isSearching, isError, results] = useOSM_Nominatim(osmQuery ?? '', config.countryCodes, config.languages);

  useEffect(() => {
    if (debouncedAddress && debouncedAddress.length >= config.minSearchCharsLength) {
      setOsmQuery(debouncedAddress);
    }
  }, [debouncedAddress]);

  useEffect(() => {
    if (!results || results.length == 0) return;
    const handledResults: NominatimResult[] = results
      .filter(x => x)
      .sort((v1, v2) => v2.importance - v1.importance)
      .map(res => ({ ...res, value: (res.type ? `(${res.type}) ` : '')  + res.display_name})); 
      // to avoid key collision ( Encountered two children with the same name-key, `Flughafenstraße, Bindersleben, Erfurt, Thuringia, 99092, Germany`.)
    console.log('handled Nominatim results (sorted by importance desc, added value field)', handledResults);
    setSuggestionsResult(handledResults);
  }, [results]);

  const onSelect = (value, choosedObject) => {
    if(!suggestionsResult || suggestionsResult.length === 0) {
      alert('Lets switch to manual searching'); //todo
      return;
    }
    if (address) choosedObject['custom_note'] = address.toUpperCase(); //we can use it to set object name when not provided
    console.log('-------- SELECTED GEO OBJECT -------');
    console.log(choosedObject);
    if (choosedObject.geojson && config.objectsToDraw.includes(choosedObject.geojson['type'])) {
      setSelectedBySearchObject(convertedToGeojsonObject(choosedObject as NominatimResult));
    }
    mapInstance.flyTo([Number(choosedObject.lat), Number(choosedObject.lon)], 15);
  }

  return (
    <div className='geosearch-wrapper'>
      <AutoComplete
        className='geosearch'
        popupMatchSelectWidth={800}
        options={suggestionsResult && suggestionsResult.length > 0
          ? suggestionsResult : [{ value: 'Nothing found, man. Explore manually on the map'}]  as AutoCompleteProps[]}
        onSelect={onSelect}
      >
        <Input.Search
          placeholder="Suche..."
          value={address}
          onChange={(e) => { if (e.target.value) setAddress(e.target.value) }}
        />
      </AutoComplete>
      {/* {isSearching && (  //todo add spiner while searching
            <Spinner className="mx-2" as="span" animation="border" size="sm" role="status" aria-hidden="true" />
        )} */}

      {/* {isError && (  //todo error handling
        )} */}
    </div>
  );
};
