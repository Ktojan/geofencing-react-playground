## dev notes
```npm install```
```npm start```
open http://0.0.0.0:8080/

## Comments on Search-Draw update logic

- ```src/hooks/useOSM_Nominatim.ts``` here is Nominatim requests logic, left it almost as it is. Pay attention to comments and restrictions
- ```src/components/AddressSearch.tsx```  I used states and some basics from this demo https://github.com/rallets/react-open-street-map-nominatim but rewrote the UI with Ant AutoComplete
- ```src/constants/types.ts``` I copied NominatimResult as was and extended with value (to display in dropdown list) and custom_note (to store custom provided name)
- ```src/index.tsx```  I wrapped all the App with <QueryClientProvider client={queryClient}>, maybe exists less radical way

  [Demo with explain](https://drive.google.com/file/d/1Awp1irwJp5Op8dw_co0zqNNJMHB2bNj7/view?usp=sharing)

Current look on Jan 9 2025 after Commit b394af59ddba8f3f69803688323659c34939e986

![9876](https://github.com/user-attachments/assets/9f4227ac-31c3-447c-ad94-33d6afa34fe4)


