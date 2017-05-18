/*!
 * ByPropertyPath.js v1.2
 * https://github.com/KingSora/ByPropertyPath
 *
 * Includes node-extend.js
 * https://github.com/justmoon/node-extend
 *
 * Copyright King Sora.
 * https://github.com/KingSora
 *
 * Released under the MIT license
 * Date: 18.05.2017
 */
(function(wnd) {
    var byPropertyPath = function() {
        var _base = this;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;

        //==START https://github.com/justmoon/node-extend

        var isArray = function isArray(arr) {
            if (typeof Array.isArray === 'function') {
                return Array.isArray(arr);
            }
            return toStr.call(arr) === '[object Array]';
        };

        var isPlainObject = function (obj) {
            if (!obj || toStr.call(obj) !== '[object Object]') {
                return false;
            }

            var hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
            var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');

            if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
                return false;
            }

            var key;
            for (key in obj) { /**/ }

            return typeof key === 'undefined' || hasOwnProperty.call(obj, key);
        };

        var extend = function() {
            var options, name, src, copy, copyIsArray, clone;
            var target = arguments[0];
            var i = 1;
            var length = arguments.length;
            var deep = false;

            // Handle a deep copy situation
            if (typeof target === 'boolean') {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            } else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
                target = {};
            }

            for (; i < length; ++i) {
                options = arguments[i];
                // Only deal with non-null/undefined values
                if (options != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target !== copy) {
                            // Recurse if we're merging plain objects or arrays
                            if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && isArray(src) ? src : [];
                                } else {
                                    clone = src && isPlainObject(src) ? src : {};
                                }

                                // Never move original objects, clone them
                                target[name] = extend(deep, clone, copy);

                                // Don't bring in undefined values
                            } else if (typeof copy !== 'undefined') {
                                target[name] = copy;
                            }
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        //==END https://github.com/justmoon/node-extend

	var isObject = function(obj) {
		return obj !== undefined && typeof obj === 'object' && obj !== null && !isArray(obj);
	};
		
        var isEmptyObject = function(obj) {
            if (obj == null)
                return true;
            if (obj.length > 0)
                return false;
            if (obj.length === 0)
                return true;
            if (typeof obj !== "object")
                return false;
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key))
                    return false;
            }
            return true;
        };

        var getPropertyByStringInternal = function(object, propertyString, propertyStringProgress, callbackOnProperty, callbackOnParentObject) {
            var strFunc = 'function';
            var found = false;
            propertyStringProgress = propertyStringProgress === undefined ? "" : propertyStringProgress;

            if(typeof propertyString !== 'string')
                return found;
            if(propertyString.length === 0)
                return found;

            if (propertyStringProgress === "") {
                var nameSplit = propertyString.split('.');
                var currObj = object;
                var nameProgression = "";
                var pathIsInvalid = false;

                for (var i = 0; i < nameSplit.length; i++) {
                    var currSplit = nameSplit[i];
                    currObj = currObj[currSplit];
                    nameProgression += currSplit + ".";
                    if (!isObject(currObj) && i + 1 !== nameSplit.length) {
                        pathIsInvalid = true;
                        break;
                    }
                }
                if(pathIsInvalid)
                    return nameProgression.slice(0, -1);
            }

            for(var prop in object) {
				if(object.hasOwnProperty(prop)) {
					var isSearchedProperty = (propertyStringProgress + prop) === propertyString;
					if(isObject(object[prop]) && !isSearchedProperty) {
						found = getPropertyByStringInternal(object[prop], propertyString, propertyStringProgress + prop + ".", callbackOnProperty, callbackOnParentObject);
						if(typeof callbackOnParentObject === strFunc)
							callbackOnParentObject(object, prop);
					}
					else if(isSearchedProperty) {
						if(typeof callbackOnProperty === strFunc)
							callbackOnProperty(object, prop);
						found = true;
					}
				}
            }
            return found;
        };

	/**
         * Indicates whether the given object has the given property path.
         * @param object {object} The object to which the property path shall be applied.
         * @param propertyPath {string} The property path which shall be checked.
         * @returns {boolean|String} True if the property path was found. False if the property path was not found. If a String is returned, the string represents the property path until where it could be solved.
         */
        _base.has = function(object, propertyPath) {
            return getPropertyByStringInternal(object, propertyPath);
        };
		
        /**
         * Gets the value of the property which is represented by the property path.
         * @param object {object} The object to which the property path shall be applied.
         * @param propertyPath {string} The property path which leads to the property which shall be get.
         * @returns {object|undefined} The property value of the property to which the given property path led. Undefined if the property path led to a non existent property.
         */
        _base.get = function(object, propertyPath) {
            var result;
            getPropertyByStringInternal(object, propertyPath, "", function(obj, prop) {
                result = obj[prop];
            });
            return result;
        };

        /**
         * Changes the value of the property which is represented by the property path.
         * If the property to which the property path leads does not exist, then nothing happens.
         * @param object {object} The object to which the property path shall be applied.
         * @param propertyPath {string} The property path which leads to the property which shall be set.
         * @param propertyValue {object} The value of the property to which the property path leads.
         * @param create {boolean} Indicates whether the property shall be created if it is not existent. With this parameter set to true the return value will be always true.
         * @returns {boolean} True if the property was found and the value was successfully changed, false otherwise.
         */
        _base.set = function(object, propertyPath, propertyValue, create) {
            var result = false;
            getPropertyByStringInternal(object, propertyPath, "", function(obj, prop) {
                obj[prop] = propertyValue;
                result = true;
            });
            if(!result && create) {
                var propertyPathSplits = propertyPath.split('.');
                var obj = { };
                var tmp = obj;
                for(var i = 0; i < propertyPathSplits.length; i++) {
                    var value = i === propertyPathSplits.length - 1 ? propertyValue : { };
                    tmp = tmp[propertyPathSplits[i]] = value;
                }
                extend(true, object, obj);
                result = true;
            }
            return result;
        };

        /**
         * Deletes the property which is represented by the property path.
         * @param object {object} The object to which the property path shall be applied.
         * @param propertyPath {string} The property path which leads to the property which shall be deleted.
         * @param deleteParentObjectIfEmpty {boolean} True if the parent object of the property which shall be deleted, shall be deleted too if it is empty after the deletion of the property.
         * @returns {boolean} True if the property to which the property path shall lead, was found and deleted, false otherwise.
         */
        _base.del = function(object, propertyPath, deleteParentObjectIfEmpty) {
            var result = false;
            getPropertyByStringInternal(object, propertyPath, "", function(obj, prop) {
                delete obj[prop];
                result = true;
            }, function (obj, prop) {
                if(deleteParentObjectIfEmpty) {
                    if (isEmptyObject(obj[prop])) {
                        delete obj[prop];
                    }
                }
            });
            return result;
        };

        /**
         * Extends the given object by the property which is represented by the property path and returns the extended object.
         * If the property which is represented by the property path already exists, then the value will be changed to the given value.
         * @param object {object} The object which shall be extended by the given property path.
         * @param propertyPath {string} The property path which represents the extension.
         * @param propertyValue {object} The value of the property to which the property path leads.
         * @returns {object} The extended object.
         */
        _base.ext = function(object, propertyPath, propertyValue) {
            var result;

            var v;
            var objects = [ ];
            var propertyStingSplit = propertyPath.split('.');

            for (v = 0; v < propertyStingSplit.length; v++) {
                objects[v] = {};
                objects[v][propertyStingSplit[v]] = {};
            }
            for (v = 0; v < objects.length; v++) {
                var set = false;
                var currObj = objects[v];
                if (v + 1 === objects.length)
                    set = true;

                for (var property in currObj) {
                    currObj[property] = objects[v + 1];
                    if (set) {
                        currObj[property] = propertyValue;
                    }
                }
            }
            return extend(true, { }, object, objects[0]);
        };
    };

    wnd.ByPropertyPath = new byPropertyPath();
})(window);
