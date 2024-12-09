# geofencing validation
This is a React demo as a proof-of-concept of geofencing mobile subjects validation. Based on Mapbox api. Well, just drag markers inside\outside selected zones and see the validation result.
Important: packages are some outdated so it's better to use older node versions, I used: node v16.13.0 (npm v8.1.0).

## dev notes
```npm install```

```npm start```

open http://0.0.0.0:8080/

Generally, you'd provide your public Mapbox key in the .env

If you faced this fkcn error False expression: Non-string value passed to "ts.resolveTypeReferenceDirective", 
cure with this: https://stackoverflow.com/questions/72488958/false-expression-non-string-value-passed-to-ts-resolvetypereferencedirective

![geofence2](https://github.com/user-attachments/assets/4fe6e2b1-ea8f-466b-a42a-ee824b1557e7)

