# ByPropertyPath.js

Manage javascript objects by a property path string.

## Usage & Documentation:
All examples are done with this object:

```javascript
var obj = {
	food : {
		burger : 'tasty',
		chilli : 'spicy',
		lemons : 'healthy'
	},
	drinks : {
		water : 'basic',
		tea : 'like a sir',
		beer : 'chill'
	}
};
```

#### Get Value:
```javascript
/**
 * Gets the value of the property which is represented by the property path.
 * @param object {object} The object to which the property path shall be applied.
 * @param propertyPath {string} The property path which leads to the property which shall be get.
 * @returns {object|undefined} The property value of the property to which the given property path led. Undefined if the property path led to a non existent property.
 */
ByPropertyPath.get = function(object, propertyPath);
```
```javascript
//with correct property path
ByPropertyPath.get(obj, "food.burger");
> "tasty"

//with incorrect property path
ByPropertyPath.get(obj, "food.sandwich");
> undefined
```

#### Set Value:
```javascript
/**
 * Changes the value of the property which is represented by the property path.
 * If the property to which the property path leads does not exist, then nothing happens.
 * @param object {object} The object to which the property path shall be applied.
 * @param propertyPath {string} The property path which leads to the property which shall be set.
 * @param propertyValue {object} The value of the property to which the property path leads.
 * @returns {boolean} True if the property was found and the value was successfully changed, false otherwise.
 */
ByPropertyPath.set = function(object, propertyPath, propertyValue);
```
```javascript
//with correct property path
ByPropertyPath.set(obj, "drinks.water" , "classic");
> true
console.log(obj.drinks.water);
> "classic"

//with incorrect property path
ByPropertyPath.set(obj, "drinks.coffee" , "eww");
> false
```

#### Delete Property:
```javascript
/**
 * Deletes the property which is represented by the property path.
 * @param object {object} The object to which the property path shall be applied.
 * @param propertyPath {string} The property path which leads to the property which shall be deleted.
 * @param deleteParentObjectIfEmpty {boolean} True if the parent object of the property which shall be deleted, shall be deleted too if it is empty after the deletion of the property.
 * @returns {boolean} True if the property to which the property path shall lead, was found and deleted, false otherwise.
 */
ByPropertyPath.del = function(object, propertyPath [, deleteParentObjectIfEmpty]);
```
```javascript
//with correct property path
ByPropertyPath.del(obj, "drinks.water");
> true
console.log(obj.drinks.water);
> undefined

//with incorrect property path
ByPropertyPath.del(obj, "drinks.coffee");
> false
```

#### Extend Object:
```javascript
/**
 * Extends the given object by the property which is represented by the property path and returns the extended object.
 * If the property which is represented by the property path already exists, then the value will be changed to the given value.
 * @param object {object} The object which shall be extended by the given property path.
 * @param propertyPath {string} The property path which represents the extension.
 * @param propertyValue {object} The value of the property to which the property path leads.
 * @returns {object} The extended object.
 */
ByPropertyPath.ext = function(object, propertyPath, propertyValue);
```
```javascript
//with not existend property
obj = ByPropertyPath.ext(obj, "drinks.coffee", "eww");
console.log(obj.drinks.coffee);
> "eww"

//with existend property - acts like set
obj = ByPropertyPath.ext(obj, "drinks.water", "classic");
console.log(obj.drinks.water);
> "classic"
```

## License:
MIT