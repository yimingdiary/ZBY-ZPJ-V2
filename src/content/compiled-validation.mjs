var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// <stdin>
var validate = validate10;
var stdin_default = validate10;
var schema11 = { "type": "object", "additionalProperties": false, "properties": { "root": { "type": "object", "additionalProperties": false, "properties": { "props": { "type": "object", "additionalProperties": false, "properties": { "chrome": { "type": "boolean" } }, "required": ["chrome"] }, "readOnly": { "type": "object", "properties": { "chrome": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["props"] }, "content": { "type": "array", "minItems": 1, "maxItems": 30, "items": { "oneOf": [{ "type": "object", "additionalProperties": false, "properties": { "type": { "const": "Navigation" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "brand": { "type": "string", "maxLength": 300 }, "items": { "type": "array", "maxItems": 8, "items": { "type": "object", "additionalProperties": false, "properties": { "label": { "type": "string", "maxLength": 300 }, "href": { "type": "string", "maxLength": 500, "pattern": "^(#|/[^/]|https://|$)" } }, "required": ["label", "href"] } }, "motto": { "type": "string", "maxLength": 300 } }, "required": ["id", "version", "brand", "items", "motto"] }, "readOnly": { "type": "object", "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "brand": { "type": "boolean" }, "items": { "type": "boolean" }, "motto": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "PortfolioHero" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "title": { "type": "string", "minLength": 1, "maxLength": 12 }, "subtitle": { "type": "string", "maxLength": 300 }, "welcome": { "type": "string", "maxLength": 300 }, "motto": { "type": "string", "maxLength": 300 }, "font": { "enum": ["display", "body"] }, "ink": { "type": "string", "pattern": "^(inherit|#[0-9a-fA-F]{6})$" }, "spacing": { "type": "number", "minimum": 4, "maximum": 30 } }, "required": ["id", "version", "title", "subtitle", "welcome", "motto", "font", "ink", "spacing"] }, "readOnly": { "type": "object", "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "title": { "type": "boolean" }, "subtitle": { "type": "boolean" }, "welcome": { "type": "boolean" }, "motto": { "type": "boolean" }, "font": { "type": "boolean" }, "ink": { "type": "boolean" }, "spacing": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "Footer" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "years": { "type": "string", "maxLength": 300 }, "category": { "type": "string", "maxLength": 300 } }, "required": ["id", "version", "years", "category"] }, "readOnly": { "type": "object", "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "years": { "type": "boolean" }, "category": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "AboutMe" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "title": { "type": "string", "maxLength": 300 }, "name": { "type": "string", "maxLength": 300 }, "englishName": { "type": "string", "maxLength": 300 }, "portraitAlt": { "type": "string", "maxLength": 300 }, "company": { "type": "string", "maxLength": 300 }, "role": { "type": "string", "maxLength": 300 }, "period": { "type": "string", "maxLength": 300 }, "portrait": { "type": "string", "maxLength": 500, "pattern": "^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$" }, "summary": { "type": "string", "maxLength": 3e3 }, "facts": { "type": "array", "maxItems": 12, "items": { "type": "object", "additionalProperties": false, "properties": { "label": { "type": "string", "maxLength": 1e3 }, "value": { "type": "string", "maxLength": 1e3 } }, "required": ["label", "value"] } }, "achievements": { "type": "array", "maxItems": 12, "items": { "type": "object", "additionalProperties": false, "properties": { "title": { "type": "string", "maxLength": 1e3 }, "description": { "type": "string", "maxLength": 1e3 } }, "required": ["title", "description"] } }, "education": { "type": "array", "maxItems": 8, "items": { "type": "object", "additionalProperties": false, "properties": { "school": { "type": "string", "maxLength": 1e3 }, "qualification": { "type": "string", "maxLength": 1e3 }, "major": { "type": "string", "maxLength": 1e3 }, "period": { "type": "string", "maxLength": 1e3 } }, "required": ["school", "qualification", "major", "period"] } }, "skills": { "type": "array", "maxItems": 20, "items": { "type": "object", "additionalProperties": false, "properties": { "label": { "type": "string", "maxLength": 1e3 } }, "required": ["label"] } } }, "required": ["id", "version", "title", "name", "englishName", "portraitAlt", "company", "role", "period", "portrait", "summary", "facts", "achievements", "education", "skills"] }, "readOnly": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "title": { "type": "boolean" }, "name": { "type": "boolean" }, "englishName": { "type": "boolean" }, "portraitAlt": { "type": "boolean" }, "company": { "type": "boolean" }, "role": { "type": "boolean" }, "period": { "type": "boolean" }, "portrait": { "type": "boolean" }, "summary": { "type": "boolean" }, "facts": { "type": "boolean" }, "achievements": { "type": "boolean" }, "education": { "type": "boolean" }, "skills": { "type": "boolean" } } } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "Contents" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "title": { "type": "string", "maxLength": 300 }, "subtitle": { "type": "string", "maxLength": 300 }, "items": { "type": "array", "maxItems": 4, "items": { "type": "object", "additionalProperties": false, "properties": { "letter": { "type": "string", "maxLength": 1 }, "number": { "type": "string", "maxLength": 2 }, "label": { "type": "string", "maxLength": 300 }, "english": { "type": "string", "maxLength": 300 }, "href": { "type": "string", "maxLength": 500, "pattern": "^(#|/[^/]|https://|$)" } }, "required": ["letter", "number", "label", "english", "href"] } } }, "required": ["id", "version", "title", "subtitle", "items"] }, "readOnly": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "title": { "type": "boolean" }, "subtitle": { "type": "boolean" }, "items": { "type": "boolean" } } } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "Closing" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "brand": { "type": "string", "maxLength": 300 }, "items": { "type": "array", "maxItems": 8, "items": { "type": "object", "additionalProperties": false, "properties": { "label": { "type": "string", "maxLength": 300 }, "href": { "type": "string", "maxLength": 500, "pattern": "^(#|/[^/]|https://|$)" } }, "required": ["label", "href"] } }, "motto": { "type": "string", "maxLength": 300 }, "title": { "type": "string", "maxLength": 12 }, "subtitle": { "type": "string", "maxLength": 300 }, "wish": { "type": "string", "maxLength": 300 }, "welcome": { "type": "string", "maxLength": 300 }, "learning": { "type": "string", "maxLength": 300 }, "years": { "type": "string", "maxLength": 300 }, "category": { "type": "string", "maxLength": 300 } }, "required": ["id", "version", "brand", "items", "motto", "title", "subtitle", "wish", "welcome", "learning", "years", "category"] }, "readOnly": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "brand": { "type": "boolean" }, "items": { "type": "boolean" }, "motto": { "type": "boolean" }, "title": { "type": "boolean" }, "subtitle": { "type": "boolean" }, "wish": { "type": "boolean" }, "welcome": { "type": "boolean" }, "learning": { "type": "boolean" }, "years": { "type": "boolean" }, "category": { "type": "boolean" } } } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "OverlayGallery" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "title": { "type": "string", "maxLength": 300 }, "subtitle": { "type": "string", "maxLength": 300 }, "category": { "type": "string", "maxLength": 300 }, "items": { "type": "array", "maxItems": 12, "items": { "type": "object", "additionalProperties": false, "properties": { "src": { "type": "string", "maxLength": 500, "pattern": "^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$" }, "alt": { "type": "string", "maxLength": 300 }, "workId": { "enum": ["", "ice-cream", "crocs", "junlebao", "auldey", "pet-life", "cat-litter", "pet-expo", "alfie-buddy"] }, "dynamic": { "type": "boolean" } }, "required": ["src", "alt"], "allOf": [{ "if": { "properties": { "dynamic": { "const": true } }, "required": ["dynamic"] }, "then": { "properties": { "src": { "enum": ["/images/works/260117_\u8D34\u7247_\u5BA0\u7269\u751F\u6D3B_\u6BDB\u5B69\u5B50/\u8D34\u7247\u9884\u89C8.jpg", "/images/overlay/pet-life.jpg", "/images/works/pet-life/cover.jpg", "/images/works/260109_\u8D34\u7247_\u94F2\u5C4E\u5B98\u732B\u7802\u7AD9_\u732B\u738B\u732B\u7802/\u8D34\u7247\u9884\u89C8.jpg", "/images/overlay/cat-litter.jpg", "/images/works/cat-litter/cover.jpg", "/images/works/250806_\u8D34\u7247_\u5BA0\u7269\u751F\u6D3B_\u62A2\u8DD1\u4E9A\u5BA0\u5C55/\u8D34\u7247\u9884\u89C8.jpg", "/images/overlay/pet-expo.jpg", "/images/works/pet-expo/cover.jpg", "/images/works/251121_\u8D34\u7247_\u5BA0\u7269\u751F\u6D3B_\u963F\u98DE\u548C\u5DF4\u5F1F/\u8D34\u7247\u9884\u89C8.jpg", "/images/overlay/alfie-buddy.jpg", "/images/works/alfie-buddy/cover.jpg"] } } } }] } }, "layout": { "type": "object", "additionalProperties": false, "properties": { "safeWidth": { "type": "number", "minimum": 0.01, "maximum": 1e4 }, "imageWidth": { "type": "number", "minimum": 0.01, "maximum": 1e4 }, "imageHeight": { "type": "number", "minimum": 0.01, "maximum": 1e4 }, "gap": { "type": "number", "minimum": 0, "maximum": 1e4 } }, "required": ["safeWidth", "imageWidth", "imageHeight", "gap"] } }, "required": ["id", "version", "title", "subtitle", "category", "items"] }, "readOnly": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "title": { "type": "boolean" }, "subtitle": { "type": "boolean" }, "category": { "type": "boolean" }, "items": { "type": "boolean" }, "layout": { "type": "boolean" } } } }, "required": ["type", "props"] }] } }, "zones": { "type": "object", "maxProperties": 0, "additionalProperties": false } }, "required": ["root", "content"] };
var func2 = require_ucs2length().default;
var func8 = Object.prototype.hasOwnProperty;
var pattern0 = new RegExp("^(#|/[^/]|https://|$)", "u");
var pattern1 = new RegExp("^(inherit|#[0-9a-fA-F]{6})$", "u");
var pattern2 = new RegExp("^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$", "u");
function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (data && typeof data == "object" && !Array.isArray(data)) {
    if (data.root === void 0) {
      const err0 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "root" }, message: "must have required property 'root'" };
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    }
    if (data.content === void 0) {
      const err1 = { instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: "content" }, message: "must have required property 'content'" };
      if (vErrors === null) {
        vErrors = [err1];
      } else {
        vErrors.push(err1);
      }
      errors++;
    }
    for (const key0 in data) {
      if (!(key0 === "root" || key0 === "content" || key0 === "zones")) {
        const err2 = { instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
    }
    if (data.root !== void 0) {
      let data0 = data.root;
      if (data0 && typeof data0 == "object" && !Array.isArray(data0)) {
        if (data0.props === void 0) {
          const err3 = { instancePath: instancePath + "/root", schemaPath: "#/properties/root/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        for (const key1 in data0) {
          if (!(key1 === "props" || key1 === "readOnly")) {
            const err4 = { instancePath: instancePath + "/root", schemaPath: "#/properties/root/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data0.props !== void 0) {
          let data1 = data0.props;
          if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
            if (data1.chrome === void 0) {
              const err5 = { instancePath: instancePath + "/root/props", schemaPath: "#/properties/root/properties/props/required", keyword: "required", params: { missingProperty: "chrome" }, message: "must have required property 'chrome'" };
              if (vErrors === null) {
                vErrors = [err5];
              } else {
                vErrors.push(err5);
              }
              errors++;
            }
            for (const key2 in data1) {
              if (!(key2 === "chrome")) {
                const err6 = { instancePath: instancePath + "/root/props", schemaPath: "#/properties/root/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key2 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err6];
                } else {
                  vErrors.push(err6);
                }
                errors++;
              }
            }
            if (data1.chrome !== void 0) {
              if (typeof data1.chrome !== "boolean") {
                const err7 = { instancePath: instancePath + "/root/props/chrome", schemaPath: "#/properties/root/properties/props/properties/chrome/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err7];
                } else {
                  vErrors.push(err7);
                }
                errors++;
              }
            }
          } else {
            const err8 = { instancePath: instancePath + "/root/props", schemaPath: "#/properties/root/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
        if (data0.readOnly !== void 0) {
          let data3 = data0.readOnly;
          if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
            for (const key3 in data3) {
              if (!(key3 === "chrome")) {
                const err9 = { instancePath: instancePath + "/root/readOnly", schemaPath: "#/properties/root/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key3 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err9];
                } else {
                  vErrors.push(err9);
                }
                errors++;
              }
            }
            if (data3.chrome !== void 0) {
              if (typeof data3.chrome !== "boolean") {
                const err10 = { instancePath: instancePath + "/root/readOnly/chrome", schemaPath: "#/properties/root/properties/readOnly/properties/chrome/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                if (vErrors === null) {
                  vErrors = [err10];
                } else {
                  vErrors.push(err10);
                }
                errors++;
              }
            }
          } else {
            const err11 = { instancePath: instancePath + "/root/readOnly", schemaPath: "#/properties/root/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err11];
            } else {
              vErrors.push(err11);
            }
            errors++;
          }
        }
      } else {
        const err12 = { instancePath: instancePath + "/root", schemaPath: "#/properties/root/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
          vErrors = [err12];
        } else {
          vErrors.push(err12);
        }
        errors++;
      }
    }
    if (data.content !== void 0) {
      let data5 = data.content;
      if (Array.isArray(data5)) {
        if (data5.length > 30) {
          const err13 = { instancePath: instancePath + "/content", schemaPath: "#/properties/content/maxItems", keyword: "maxItems", params: { limit: 30 }, message: "must NOT have more than 30 items" };
          if (vErrors === null) {
            vErrors = [err13];
          } else {
            vErrors.push(err13);
          }
          errors++;
        }
        if (data5.length < 1) {
          const err14 = { instancePath: instancePath + "/content", schemaPath: "#/properties/content/minItems", keyword: "minItems", params: { limit: 1 }, message: "must NOT have fewer than 1 items" };
          if (vErrors === null) {
            vErrors = [err14];
          } else {
            vErrors.push(err14);
          }
          errors++;
        }
        const len0 = data5.length;
        for (let i0 = 0; i0 < len0; i0++) {
          let data6 = data5[i0];
          const _errs18 = errors;
          let valid6 = false;
          let passing0 = null;
          const _errs19 = errors;
          if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
            if (data6.type === void 0) {
              const err15 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/0/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
              if (vErrors === null) {
                vErrors = [err15];
              } else {
                vErrors.push(err15);
              }
              errors++;
            }
            if (data6.props === void 0) {
              const err16 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/0/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
              if (vErrors === null) {
                vErrors = [err16];
              } else {
                vErrors.push(err16);
              }
              errors++;
            }
            for (const key4 in data6) {
              if (!(key4 === "type" || key4 === "props" || key4 === "readOnly")) {
                const err17 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/0/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key4 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err17];
                } else {
                  vErrors.push(err17);
                }
                errors++;
              }
            }
            if (data6.type !== void 0) {
              if ("Navigation" !== data6.type) {
                const err18 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/0/properties/type/const", keyword: "const", params: { allowedValue: "Navigation" }, message: "must be equal to constant" };
                if (vErrors === null) {
                  vErrors = [err18];
                } else {
                  vErrors.push(err18);
                }
                errors++;
              }
            }
            if (data6.props !== void 0) {
              let data8 = data6.props;
              if (data8 && typeof data8 == "object" && !Array.isArray(data8)) {
                if (data8.id === void 0) {
                  const err19 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                  if (vErrors === null) {
                    vErrors = [err19];
                  } else {
                    vErrors.push(err19);
                  }
                  errors++;
                }
                if (data8.version === void 0) {
                  const err20 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                  if (vErrors === null) {
                    vErrors = [err20];
                  } else {
                    vErrors.push(err20);
                  }
                  errors++;
                }
                if (data8.brand === void 0) {
                  const err21 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/required", keyword: "required", params: { missingProperty: "brand" }, message: "must have required property 'brand'" };
                  if (vErrors === null) {
                    vErrors = [err21];
                  } else {
                    vErrors.push(err21);
                  }
                  errors++;
                }
                if (data8.items === void 0) {
                  const err22 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/required", keyword: "required", params: { missingProperty: "items" }, message: "must have required property 'items'" };
                  if (vErrors === null) {
                    vErrors = [err22];
                  } else {
                    vErrors.push(err22);
                  }
                  errors++;
                }
                if (data8.motto === void 0) {
                  const err23 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/required", keyword: "required", params: { missingProperty: "motto" }, message: "must have required property 'motto'" };
                  if (vErrors === null) {
                    vErrors = [err23];
                  } else {
                    vErrors.push(err23);
                  }
                  errors++;
                }
                for (const key5 in data8) {
                  if (!(key5 === "id" || key5 === "version" || key5 === "brand" || key5 === "items" || key5 === "motto")) {
                    const err24 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key5 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err24];
                    } else {
                      vErrors.push(err24);
                    }
                    errors++;
                  }
                }
                if (data8.id !== void 0) {
                  let data9 = data8.id;
                  if (typeof data9 === "string") {
                    if (func2(data9) > 100) {
                      const err25 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                      if (vErrors === null) {
                        vErrors = [err25];
                      } else {
                        vErrors.push(err25);
                      }
                      errors++;
                    }
                    if (func2(data9) < 1) {
                      const err26 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                      if (vErrors === null) {
                        vErrors = [err26];
                      } else {
                        vErrors.push(err26);
                      }
                      errors++;
                    }
                  } else {
                    const err27 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err27];
                    } else {
                      vErrors.push(err27);
                    }
                    errors++;
                  }
                }
                if (data8.version !== void 0) {
                  if (1 !== data8.version) {
                    const err28 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err28];
                    } else {
                      vErrors.push(err28);
                    }
                    errors++;
                  }
                }
                if (data8.brand !== void 0) {
                  let data11 = data8.brand;
                  if (typeof data11 === "string") {
                    if (func2(data11) > 300) {
                      const err29 = { instancePath: instancePath + "/content/" + i0 + "/props/brand", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/brand/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                      if (vErrors === null) {
                        vErrors = [err29];
                      } else {
                        vErrors.push(err29);
                      }
                      errors++;
                    }
                  } else {
                    const err30 = { instancePath: instancePath + "/content/" + i0 + "/props/brand", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/brand/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err30];
                    } else {
                      vErrors.push(err30);
                    }
                    errors++;
                  }
                }
                if (data8.items !== void 0) {
                  let data12 = data8.items;
                  if (Array.isArray(data12)) {
                    if (data12.length > 8) {
                      const err31 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" };
                      if (vErrors === null) {
                        vErrors = [err31];
                      } else {
                        vErrors.push(err31);
                      }
                      errors++;
                    }
                    const len1 = data12.length;
                    for (let i1 = 0; i1 < len1; i1++) {
                      let data13 = data12[i1];
                      if (data13 && typeof data13 == "object" && !Array.isArray(data13)) {
                        if (data13.label === void 0) {
                          const err32 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1, schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "label" }, message: "must have required property 'label'" };
                          if (vErrors === null) {
                            vErrors = [err32];
                          } else {
                            vErrors.push(err32);
                          }
                          errors++;
                        }
                        if (data13.href === void 0) {
                          const err33 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1, schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "href" }, message: "must have required property 'href'" };
                          if (vErrors === null) {
                            vErrors = [err33];
                          } else {
                            vErrors.push(err33);
                          }
                          errors++;
                        }
                        for (const key6 in data13) {
                          if (!(key6 === "label" || key6 === "href")) {
                            const err34 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1, schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key6 }, message: "must NOT have additional properties" };
                            if (vErrors === null) {
                              vErrors = [err34];
                            } else {
                              vErrors.push(err34);
                            }
                            errors++;
                          }
                        }
                        if (data13.label !== void 0) {
                          let data14 = data13.label;
                          if (typeof data14 === "string") {
                            if (func2(data14) > 300) {
                              const err35 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1 + "/label", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/properties/label/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err35];
                              } else {
                                vErrors.push(err35);
                              }
                              errors++;
                            }
                          } else {
                            const err36 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1 + "/label", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/properties/label/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err36];
                            } else {
                              vErrors.push(err36);
                            }
                            errors++;
                          }
                        }
                        if (data13.href !== void 0) {
                          let data15 = data13.href;
                          if (typeof data15 === "string") {
                            if (func2(data15) > 500) {
                              const err37 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1 + "/href", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/properties/href/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                              if (vErrors === null) {
                                vErrors = [err37];
                              } else {
                                vErrors.push(err37);
                              }
                              errors++;
                            }
                            if (!pattern0.test(data15)) {
                              const err38 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1 + "/href", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/properties/href/pattern", keyword: "pattern", params: { pattern: "^(#|/[^/]|https://|$)" }, message: 'must match pattern "^(#|/[^/]|https://|$)"' };
                              if (vErrors === null) {
                                vErrors = [err38];
                              } else {
                                vErrors.push(err38);
                              }
                              errors++;
                            }
                          } else {
                            const err39 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1 + "/href", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/properties/href/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err39];
                            } else {
                              vErrors.push(err39);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err40 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i1, schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                        if (vErrors === null) {
                          vErrors = [err40];
                        } else {
                          vErrors.push(err40);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err41 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/items/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                    if (vErrors === null) {
                      vErrors = [err41];
                    } else {
                      vErrors.push(err41);
                    }
                    errors++;
                  }
                }
                if (data8.motto !== void 0) {
                  let data16 = data8.motto;
                  if (typeof data16 === "string") {
                    if (func2(data16) > 300) {
                      const err42 = { instancePath: instancePath + "/content/" + i0 + "/props/motto", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/motto/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                      if (vErrors === null) {
                        vErrors = [err42];
                      } else {
                        vErrors.push(err42);
                      }
                      errors++;
                    }
                  } else {
                    const err43 = { instancePath: instancePath + "/content/" + i0 + "/props/motto", schemaPath: "#/properties/content/items/oneOf/0/properties/props/properties/motto/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err43];
                    } else {
                      vErrors.push(err43);
                    }
                    errors++;
                  }
                }
              } else {
                const err44 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/0/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err44];
                } else {
                  vErrors.push(err44);
                }
                errors++;
              }
            }
            if (data6.readOnly !== void 0) {
              let data17 = data6.readOnly;
              if (data17 && typeof data17 == "object" && !Array.isArray(data17)) {
                for (const key7 in data17) {
                  if (!(key7 === "id" || key7 === "version" || key7 === "brand" || key7 === "items" || key7 === "motto")) {
                    const err45 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key7 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err45];
                    } else {
                      vErrors.push(err45);
                    }
                    errors++;
                  }
                }
                if (data17.id !== void 0) {
                  if (typeof data17.id !== "boolean") {
                    const err46 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err46];
                    } else {
                      vErrors.push(err46);
                    }
                    errors++;
                  }
                }
                if (data17.version !== void 0) {
                  if (typeof data17.version !== "boolean") {
                    const err47 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err47];
                    } else {
                      vErrors.push(err47);
                    }
                    errors++;
                  }
                }
                if (data17.brand !== void 0) {
                  if (typeof data17.brand !== "boolean") {
                    const err48 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/brand", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/properties/brand/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err48];
                    } else {
                      vErrors.push(err48);
                    }
                    errors++;
                  }
                }
                if (data17.items !== void 0) {
                  if (typeof data17.items !== "boolean") {
                    const err49 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/items", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/properties/items/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err49];
                    } else {
                      vErrors.push(err49);
                    }
                    errors++;
                  }
                }
                if (data17.motto !== void 0) {
                  if (typeof data17.motto !== "boolean") {
                    const err50 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/motto", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/properties/motto/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err50];
                    } else {
                      vErrors.push(err50);
                    }
                    errors++;
                  }
                }
              } else {
                const err51 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/0/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err51];
                } else {
                  vErrors.push(err51);
                }
                errors++;
              }
            }
          } else {
            const err52 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/0/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err52];
            } else {
              vErrors.push(err52);
            }
            errors++;
          }
          var _valid0 = _errs19 === errors;
          if (_valid0) {
            valid6 = true;
            passing0 = 0;
          }
          const _errs55 = errors;
          if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
            if (data6.type === void 0) {
              const err53 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/1/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
              if (vErrors === null) {
                vErrors = [err53];
              } else {
                vErrors.push(err53);
              }
              errors++;
            }
            if (data6.props === void 0) {
              const err54 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/1/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
              if (vErrors === null) {
                vErrors = [err54];
              } else {
                vErrors.push(err54);
              }
              errors++;
            }
            for (const key8 in data6) {
              if (!(key8 === "type" || key8 === "props" || key8 === "readOnly")) {
                const err55 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/1/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key8 }, message: "must NOT have additional properties" };
                if (vErrors === null) {
                  vErrors = [err55];
                } else {
                  vErrors.push(err55);
                }
                errors++;
              }
            }
            if (data6.type !== void 0) {
              if ("PortfolioHero" !== data6.type) {
                const err56 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/1/properties/type/const", keyword: "const", params: { allowedValue: "PortfolioHero" }, message: "must be equal to constant" };
                if (vErrors === null) {
                  vErrors = [err56];
                } else {
                  vErrors.push(err56);
                }
                errors++;
              }
            }
            if (data6.props !== void 0) {
              let data24 = data6.props;
              if (data24 && typeof data24 == "object" && !Array.isArray(data24)) {
                if (data24.id === void 0) {
                  const err57 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                  if (vErrors === null) {
                    vErrors = [err57];
                  } else {
                    vErrors.push(err57);
                  }
                  errors++;
                }
                if (data24.version === void 0) {
                  const err58 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                  if (vErrors === null) {
                    vErrors = [err58];
                  } else {
                    vErrors.push(err58);
                  }
                  errors++;
                }
                if (data24.title === void 0) {
                  const err59 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "title" }, message: "must have required property 'title'" };
                  if (vErrors === null) {
                    vErrors = [err59];
                  } else {
                    vErrors.push(err59);
                  }
                  errors++;
                }
                if (data24.subtitle === void 0) {
                  const err60 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "subtitle" }, message: "must have required property 'subtitle'" };
                  if (vErrors === null) {
                    vErrors = [err60];
                  } else {
                    vErrors.push(err60);
                  }
                  errors++;
                }
                if (data24.welcome === void 0) {
                  const err61 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "welcome" }, message: "must have required property 'welcome'" };
                  if (vErrors === null) {
                    vErrors = [err61];
                  } else {
                    vErrors.push(err61);
                  }
                  errors++;
                }
                if (data24.motto === void 0) {
                  const err62 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "motto" }, message: "must have required property 'motto'" };
                  if (vErrors === null) {
                    vErrors = [err62];
                  } else {
                    vErrors.push(err62);
                  }
                  errors++;
                }
                if (data24.font === void 0) {
                  const err63 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "font" }, message: "must have required property 'font'" };
                  if (vErrors === null) {
                    vErrors = [err63];
                  } else {
                    vErrors.push(err63);
                  }
                  errors++;
                }
                if (data24.ink === void 0) {
                  const err64 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "ink" }, message: "must have required property 'ink'" };
                  if (vErrors === null) {
                    vErrors = [err64];
                  } else {
                    vErrors.push(err64);
                  }
                  errors++;
                }
                if (data24.spacing === void 0) {
                  const err65 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/required", keyword: "required", params: { missingProperty: "spacing" }, message: "must have required property 'spacing'" };
                  if (vErrors === null) {
                    vErrors = [err65];
                  } else {
                    vErrors.push(err65);
                  }
                  errors++;
                }
                for (const key9 in data24) {
                  if (!func8.call(schema11.properties.content.items.oneOf[1].properties.props.properties, key9)) {
                    const err66 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key9 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err66];
                    } else {
                      vErrors.push(err66);
                    }
                    errors++;
                  }
                }
                if (data24.id !== void 0) {
                  let data25 = data24.id;
                  if (typeof data25 === "string") {
                    if (func2(data25) > 100) {
                      const err67 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                      if (vErrors === null) {
                        vErrors = [err67];
                      } else {
                        vErrors.push(err67);
                      }
                      errors++;
                    }
                    if (func2(data25) < 1) {
                      const err68 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                      if (vErrors === null) {
                        vErrors = [err68];
                      } else {
                        vErrors.push(err68);
                      }
                      errors++;
                    }
                  } else {
                    const err69 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err69];
                    } else {
                      vErrors.push(err69);
                    }
                    errors++;
                  }
                }
                if (data24.version !== void 0) {
                  if (1 !== data24.version) {
                    const err70 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err70];
                    } else {
                      vErrors.push(err70);
                    }
                    errors++;
                  }
                }
                if (data24.title !== void 0) {
                  let data27 = data24.title;
                  if (typeof data27 === "string") {
                    if (func2(data27) > 12) {
                      const err71 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/title/maxLength", keyword: "maxLength", params: { limit: 12 }, message: "must NOT have more than 12 characters" };
                      if (vErrors === null) {
                        vErrors = [err71];
                      } else {
                        vErrors.push(err71);
                      }
                      errors++;
                    }
                    if (func2(data27) < 1) {
                      const err72 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/title/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                      if (vErrors === null) {
                        vErrors = [err72];
                      } else {
                        vErrors.push(err72);
                      }
                      errors++;
                    }
                  } else {
                    const err73 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err73];
                    } else {
                      vErrors.push(err73);
                    }
                    errors++;
                  }
                }
                if (data24.subtitle !== void 0) {
                  let data28 = data24.subtitle;
                  if (typeof data28 === "string") {
                    if (func2(data28) > 300) {
                      const err74 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/subtitle/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                      if (vErrors === null) {
                        vErrors = [err74];
                      } else {
                        vErrors.push(err74);
                      }
                      errors++;
                    }
                  } else {
                    const err75 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/subtitle/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err75];
                    } else {
                      vErrors.push(err75);
                    }
                    errors++;
                  }
                }
                if (data24.welcome !== void 0) {
                  let data29 = data24.welcome;
                  if (typeof data29 === "string") {
                    if (func2(data29) > 300) {
                      const err76 = { instancePath: instancePath + "/content/" + i0 + "/props/welcome", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/welcome/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                      if (vErrors === null) {
                        vErrors = [err76];
                      } else {
                        vErrors.push(err76);
                      }
                      errors++;
                    }
                  } else {
                    const err77 = { instancePath: instancePath + "/content/" + i0 + "/props/welcome", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/welcome/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err77];
                    } else {
                      vErrors.push(err77);
                    }
                    errors++;
                  }
                }
                if (data24.motto !== void 0) {
                  let data30 = data24.motto;
                  if (typeof data30 === "string") {
                    if (func2(data30) > 300) {
                      const err78 = { instancePath: instancePath + "/content/" + i0 + "/props/motto", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/motto/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                      if (vErrors === null) {
                        vErrors = [err78];
                      } else {
                        vErrors.push(err78);
                      }
                      errors++;
                    }
                  } else {
                    const err79 = { instancePath: instancePath + "/content/" + i0 + "/props/motto", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/motto/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err79];
                    } else {
                      vErrors.push(err79);
                    }
                    errors++;
                  }
                }
                if (data24.font !== void 0) {
                  let data31 = data24.font;
                  if (!(data31 === "display" || data31 === "body")) {
                    const err80 = { instancePath: instancePath + "/content/" + i0 + "/props/font", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/font/enum", keyword: "enum", params: { allowedValues: schema11.properties.content.items.oneOf[1].properties.props.properties.font.enum }, message: "must be equal to one of the allowed values" };
                    if (vErrors === null) {
                      vErrors = [err80];
                    } else {
                      vErrors.push(err80);
                    }
                    errors++;
                  }
                }
                if (data24.ink !== void 0) {
                  let data32 = data24.ink;
                  if (typeof data32 === "string") {
                    if (!pattern1.test(data32)) {
                      const err81 = { instancePath: instancePath + "/content/" + i0 + "/props/ink", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/ink/pattern", keyword: "pattern", params: { pattern: "^(inherit|#[0-9a-fA-F]{6})$" }, message: 'must match pattern "^(inherit|#[0-9a-fA-F]{6})$"' };
                      if (vErrors === null) {
                        vErrors = [err81];
                      } else {
                        vErrors.push(err81);
                      }
                      errors++;
                    }
                  } else {
                    const err82 = { instancePath: instancePath + "/content/" + i0 + "/props/ink", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/ink/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                    if (vErrors === null) {
                      vErrors = [err82];
                    } else {
                      vErrors.push(err82);
                    }
                    errors++;
                  }
                }
                if (data24.spacing !== void 0) {
                  let data33 = data24.spacing;
                  if (typeof data33 == "number" && isFinite(data33)) {
                    if (data33 > 30 || isNaN(data33)) {
                      const err83 = { instancePath: instancePath + "/content/" + i0 + "/props/spacing", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/spacing/maximum", keyword: "maximum", params: { comparison: "<=", limit: 30 }, message: "must be <= 30" };
                      if (vErrors === null) {
                        vErrors = [err83];
                      } else {
                        vErrors.push(err83);
                      }
                      errors++;
                    }
                    if (data33 < 4 || isNaN(data33)) {
                      const err84 = { instancePath: instancePath + "/content/" + i0 + "/props/spacing", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/spacing/minimum", keyword: "minimum", params: { comparison: ">=", limit: 4 }, message: "must be >= 4" };
                      if (vErrors === null) {
                        vErrors = [err84];
                      } else {
                        vErrors.push(err84);
                      }
                      errors++;
                    }
                  } else {
                    const err85 = { instancePath: instancePath + "/content/" + i0 + "/props/spacing", schemaPath: "#/properties/content/items/oneOf/1/properties/props/properties/spacing/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                    if (vErrors === null) {
                      vErrors = [err85];
                    } else {
                      vErrors.push(err85);
                    }
                    errors++;
                  }
                }
              } else {
                const err86 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/1/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err86];
                } else {
                  vErrors.push(err86);
                }
                errors++;
              }
            }
            if (data6.readOnly !== void 0) {
              let data34 = data6.readOnly;
              if (data34 && typeof data34 == "object" && !Array.isArray(data34)) {
                for (const key10 in data34) {
                  if (!func8.call(schema11.properties.content.items.oneOf[1].properties.readOnly.properties, key10)) {
                    const err87 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key10 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err87];
                    } else {
                      vErrors.push(err87);
                    }
                    errors++;
                  }
                }
                if (data34.id !== void 0) {
                  if (typeof data34.id !== "boolean") {
                    const err88 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err88];
                    } else {
                      vErrors.push(err88);
                    }
                    errors++;
                  }
                }
                if (data34.version !== void 0) {
                  if (typeof data34.version !== "boolean") {
                    const err89 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err89];
                    } else {
                      vErrors.push(err89);
                    }
                    errors++;
                  }
                }
                if (data34.title !== void 0) {
                  if (typeof data34.title !== "boolean") {
                    const err90 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/title", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/title/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err90];
                    } else {
                      vErrors.push(err90);
                    }
                    errors++;
                  }
                }
                if (data34.subtitle !== void 0) {
                  if (typeof data34.subtitle !== "boolean") {
                    const err91 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/subtitle", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/subtitle/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err91];
                    } else {
                      vErrors.push(err91);
                    }
                    errors++;
                  }
                }
                if (data34.welcome !== void 0) {
                  if (typeof data34.welcome !== "boolean") {
                    const err92 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/welcome", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/welcome/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err92];
                    } else {
                      vErrors.push(err92);
                    }
                    errors++;
                  }
                }
                if (data34.motto !== void 0) {
                  if (typeof data34.motto !== "boolean") {
                    const err93 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/motto", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/motto/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err93];
                    } else {
                      vErrors.push(err93);
                    }
                    errors++;
                  }
                }
                if (data34.font !== void 0) {
                  if (typeof data34.font !== "boolean") {
                    const err94 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/font", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/font/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err94];
                    } else {
                      vErrors.push(err94);
                    }
                    errors++;
                  }
                }
                if (data34.ink !== void 0) {
                  if (typeof data34.ink !== "boolean") {
                    const err95 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/ink", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/ink/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err95];
                    } else {
                      vErrors.push(err95);
                    }
                    errors++;
                  }
                }
                if (data34.spacing !== void 0) {
                  if (typeof data34.spacing !== "boolean") {
                    const err96 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/spacing", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/properties/spacing/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                    if (vErrors === null) {
                      vErrors = [err96];
                    } else {
                      vErrors.push(err96);
                    }
                    errors++;
                  }
                }
              } else {
                const err97 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/1/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err97];
                } else {
                  vErrors.push(err97);
                }
                errors++;
              }
            }
          } else {
            const err98 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/1/type", keyword: "type", params: { type: "object" }, message: "must be object" };
            if (vErrors === null) {
              vErrors = [err98];
            } else {
              vErrors.push(err98);
            }
            errors++;
          }
          var _valid0 = _errs55 === errors;
          if (_valid0 && valid6) {
            valid6 = false;
            passing0 = [passing0, 1];
          } else {
            if (_valid0) {
              valid6 = true;
              passing0 = 1;
            }
            const _errs99 = errors;
            if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
              if (data6.type === void 0) {
                const err99 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/2/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
                if (vErrors === null) {
                  vErrors = [err99];
                } else {
                  vErrors.push(err99);
                }
                errors++;
              }
              if (data6.props === void 0) {
                const err100 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/2/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
                if (vErrors === null) {
                  vErrors = [err100];
                } else {
                  vErrors.push(err100);
                }
                errors++;
              }
              for (const key11 in data6) {
                if (!(key11 === "type" || key11 === "props" || key11 === "readOnly")) {
                  const err101 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/2/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key11 }, message: "must NOT have additional properties" };
                  if (vErrors === null) {
                    vErrors = [err101];
                  } else {
                    vErrors.push(err101);
                  }
                  errors++;
                }
              }
              if (data6.type !== void 0) {
                if ("Footer" !== data6.type) {
                  const err102 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/2/properties/type/const", keyword: "const", params: { allowedValue: "Footer" }, message: "must be equal to constant" };
                  if (vErrors === null) {
                    vErrors = [err102];
                  } else {
                    vErrors.push(err102);
                  }
                  errors++;
                }
              }
              if (data6.props !== void 0) {
                let data45 = data6.props;
                if (data45 && typeof data45 == "object" && !Array.isArray(data45)) {
                  if (data45.id === void 0) {
                    const err103 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/2/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                    if (vErrors === null) {
                      vErrors = [err103];
                    } else {
                      vErrors.push(err103);
                    }
                    errors++;
                  }
                  if (data45.version === void 0) {
                    const err104 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/2/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                    if (vErrors === null) {
                      vErrors = [err104];
                    } else {
                      vErrors.push(err104);
                    }
                    errors++;
                  }
                  if (data45.years === void 0) {
                    const err105 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/2/properties/props/required", keyword: "required", params: { missingProperty: "years" }, message: "must have required property 'years'" };
                    if (vErrors === null) {
                      vErrors = [err105];
                    } else {
                      vErrors.push(err105);
                    }
                    errors++;
                  }
                  if (data45.category === void 0) {
                    const err106 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/2/properties/props/required", keyword: "required", params: { missingProperty: "category" }, message: "must have required property 'category'" };
                    if (vErrors === null) {
                      vErrors = [err106];
                    } else {
                      vErrors.push(err106);
                    }
                    errors++;
                  }
                  for (const key12 in data45) {
                    if (!(key12 === "id" || key12 === "version" || key12 === "years" || key12 === "category")) {
                      const err107 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/2/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key12 }, message: "must NOT have additional properties" };
                      if (vErrors === null) {
                        vErrors = [err107];
                      } else {
                        vErrors.push(err107);
                      }
                      errors++;
                    }
                  }
                  if (data45.id !== void 0) {
                    let data46 = data45.id;
                    if (typeof data46 === "string") {
                      if (func2(data46) > 100) {
                        const err108 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                        if (vErrors === null) {
                          vErrors = [err108];
                        } else {
                          vErrors.push(err108);
                        }
                        errors++;
                      }
                      if (func2(data46) < 1) {
                        const err109 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                        if (vErrors === null) {
                          vErrors = [err109];
                        } else {
                          vErrors.push(err109);
                        }
                        errors++;
                      }
                    } else {
                      const err110 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err110];
                      } else {
                        vErrors.push(err110);
                      }
                      errors++;
                    }
                  }
                  if (data45.version !== void 0) {
                    if (1 !== data45.version) {
                      const err111 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err111];
                      } else {
                        vErrors.push(err111);
                      }
                      errors++;
                    }
                  }
                  if (data45.years !== void 0) {
                    let data48 = data45.years;
                    if (typeof data48 === "string") {
                      if (func2(data48) > 300) {
                        const err112 = { instancePath: instancePath + "/content/" + i0 + "/props/years", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/years/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                        if (vErrors === null) {
                          vErrors = [err112];
                        } else {
                          vErrors.push(err112);
                        }
                        errors++;
                      }
                    } else {
                      const err113 = { instancePath: instancePath + "/content/" + i0 + "/props/years", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/years/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err113];
                      } else {
                        vErrors.push(err113);
                      }
                      errors++;
                    }
                  }
                  if (data45.category !== void 0) {
                    let data49 = data45.category;
                    if (typeof data49 === "string") {
                      if (func2(data49) > 300) {
                        const err114 = { instancePath: instancePath + "/content/" + i0 + "/props/category", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/category/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                        if (vErrors === null) {
                          vErrors = [err114];
                        } else {
                          vErrors.push(err114);
                        }
                        errors++;
                      }
                    } else {
                      const err115 = { instancePath: instancePath + "/content/" + i0 + "/props/category", schemaPath: "#/properties/content/items/oneOf/2/properties/props/properties/category/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                      if (vErrors === null) {
                        vErrors = [err115];
                      } else {
                        vErrors.push(err115);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err116 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/2/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                  if (vErrors === null) {
                    vErrors = [err116];
                  } else {
                    vErrors.push(err116);
                  }
                  errors++;
                }
              }
              if (data6.readOnly !== void 0) {
                let data50 = data6.readOnly;
                if (data50 && typeof data50 == "object" && !Array.isArray(data50)) {
                  for (const key13 in data50) {
                    if (!(key13 === "id" || key13 === "version" || key13 === "years" || key13 === "category")) {
                      const err117 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/2/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key13 }, message: "must NOT have additional properties" };
                      if (vErrors === null) {
                        vErrors = [err117];
                      } else {
                        vErrors.push(err117);
                      }
                      errors++;
                    }
                  }
                  if (data50.id !== void 0) {
                    if (typeof data50.id !== "boolean") {
                      const err118 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/2/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                      if (vErrors === null) {
                        vErrors = [err118];
                      } else {
                        vErrors.push(err118);
                      }
                      errors++;
                    }
                  }
                  if (data50.version !== void 0) {
                    if (typeof data50.version !== "boolean") {
                      const err119 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/2/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                      if (vErrors === null) {
                        vErrors = [err119];
                      } else {
                        vErrors.push(err119);
                      }
                      errors++;
                    }
                  }
                  if (data50.years !== void 0) {
                    if (typeof data50.years !== "boolean") {
                      const err120 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/years", schemaPath: "#/properties/content/items/oneOf/2/properties/readOnly/properties/years/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                      if (vErrors === null) {
                        vErrors = [err120];
                      } else {
                        vErrors.push(err120);
                      }
                      errors++;
                    }
                  }
                  if (data50.category !== void 0) {
                    if (typeof data50.category !== "boolean") {
                      const err121 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/category", schemaPath: "#/properties/content/items/oneOf/2/properties/readOnly/properties/category/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                      if (vErrors === null) {
                        vErrors = [err121];
                      } else {
                        vErrors.push(err121);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err122 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/2/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                  if (vErrors === null) {
                    vErrors = [err122];
                  } else {
                    vErrors.push(err122);
                  }
                  errors++;
                }
              }
            } else {
              const err123 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/2/type", keyword: "type", params: { type: "object" }, message: "must be object" };
              if (vErrors === null) {
                vErrors = [err123];
              } else {
                vErrors.push(err123);
              }
              errors++;
            }
            var _valid0 = _errs99 === errors;
            if (_valid0 && valid6) {
              valid6 = false;
              passing0 = [passing0, 2];
            } else {
              if (_valid0) {
                valid6 = true;
                passing0 = 2;
              }
              const _errs124 = errors;
              if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                if (data6.type === void 0) {
                  const err124 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/3/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
                  if (vErrors === null) {
                    vErrors = [err124];
                  } else {
                    vErrors.push(err124);
                  }
                  errors++;
                }
                if (data6.props === void 0) {
                  const err125 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/3/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
                  if (vErrors === null) {
                    vErrors = [err125];
                  } else {
                    vErrors.push(err125);
                  }
                  errors++;
                }
                for (const key14 in data6) {
                  if (!(key14 === "type" || key14 === "props" || key14 === "readOnly")) {
                    const err126 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/3/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key14 }, message: "must NOT have additional properties" };
                    if (vErrors === null) {
                      vErrors = [err126];
                    } else {
                      vErrors.push(err126);
                    }
                    errors++;
                  }
                }
                if (data6.type !== void 0) {
                  if ("AboutMe" !== data6.type) {
                    const err127 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/3/properties/type/const", keyword: "const", params: { allowedValue: "AboutMe" }, message: "must be equal to constant" };
                    if (vErrors === null) {
                      vErrors = [err127];
                    } else {
                      vErrors.push(err127);
                    }
                    errors++;
                  }
                }
                if (data6.props !== void 0) {
                  let data56 = data6.props;
                  if (data56 && typeof data56 == "object" && !Array.isArray(data56)) {
                    if (data56.id === void 0) {
                      const err128 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                      if (vErrors === null) {
                        vErrors = [err128];
                      } else {
                        vErrors.push(err128);
                      }
                      errors++;
                    }
                    if (data56.version === void 0) {
                      const err129 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                      if (vErrors === null) {
                        vErrors = [err129];
                      } else {
                        vErrors.push(err129);
                      }
                      errors++;
                    }
                    if (data56.title === void 0) {
                      const err130 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "title" }, message: "must have required property 'title'" };
                      if (vErrors === null) {
                        vErrors = [err130];
                      } else {
                        vErrors.push(err130);
                      }
                      errors++;
                    }
                    if (data56.name === void 0) {
                      const err131 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "name" }, message: "must have required property 'name'" };
                      if (vErrors === null) {
                        vErrors = [err131];
                      } else {
                        vErrors.push(err131);
                      }
                      errors++;
                    }
                    if (data56.englishName === void 0) {
                      const err132 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "englishName" }, message: "must have required property 'englishName'" };
                      if (vErrors === null) {
                        vErrors = [err132];
                      } else {
                        vErrors.push(err132);
                      }
                      errors++;
                    }
                    if (data56.portraitAlt === void 0) {
                      const err133 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "portraitAlt" }, message: "must have required property 'portraitAlt'" };
                      if (vErrors === null) {
                        vErrors = [err133];
                      } else {
                        vErrors.push(err133);
                      }
                      errors++;
                    }
                    if (data56.company === void 0) {
                      const err134 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "company" }, message: "must have required property 'company'" };
                      if (vErrors === null) {
                        vErrors = [err134];
                      } else {
                        vErrors.push(err134);
                      }
                      errors++;
                    }
                    if (data56.role === void 0) {
                      const err135 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "role" }, message: "must have required property 'role'" };
                      if (vErrors === null) {
                        vErrors = [err135];
                      } else {
                        vErrors.push(err135);
                      }
                      errors++;
                    }
                    if (data56.period === void 0) {
                      const err136 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "period" }, message: "must have required property 'period'" };
                      if (vErrors === null) {
                        vErrors = [err136];
                      } else {
                        vErrors.push(err136);
                      }
                      errors++;
                    }
                    if (data56.portrait === void 0) {
                      const err137 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "portrait" }, message: "must have required property 'portrait'" };
                      if (vErrors === null) {
                        vErrors = [err137];
                      } else {
                        vErrors.push(err137);
                      }
                      errors++;
                    }
                    if (data56.summary === void 0) {
                      const err138 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "summary" }, message: "must have required property 'summary'" };
                      if (vErrors === null) {
                        vErrors = [err138];
                      } else {
                        vErrors.push(err138);
                      }
                      errors++;
                    }
                    if (data56.facts === void 0) {
                      const err139 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "facts" }, message: "must have required property 'facts'" };
                      if (vErrors === null) {
                        vErrors = [err139];
                      } else {
                        vErrors.push(err139);
                      }
                      errors++;
                    }
                    if (data56.achievements === void 0) {
                      const err140 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "achievements" }, message: "must have required property 'achievements'" };
                      if (vErrors === null) {
                        vErrors = [err140];
                      } else {
                        vErrors.push(err140);
                      }
                      errors++;
                    }
                    if (data56.education === void 0) {
                      const err141 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "education" }, message: "must have required property 'education'" };
                      if (vErrors === null) {
                        vErrors = [err141];
                      } else {
                        vErrors.push(err141);
                      }
                      errors++;
                    }
                    if (data56.skills === void 0) {
                      const err142 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/required", keyword: "required", params: { missingProperty: "skills" }, message: "must have required property 'skills'" };
                      if (vErrors === null) {
                        vErrors = [err142];
                      } else {
                        vErrors.push(err142);
                      }
                      errors++;
                    }
                    for (const key15 in data56) {
                      if (!func8.call(schema11.properties.content.items.oneOf[3].properties.props.properties, key15)) {
                        const err143 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key15 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err143];
                        } else {
                          vErrors.push(err143);
                        }
                        errors++;
                      }
                    }
                    if (data56.id !== void 0) {
                      let data57 = data56.id;
                      if (typeof data57 === "string") {
                        if (func2(data57) > 100) {
                          const err144 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                          if (vErrors === null) {
                            vErrors = [err144];
                          } else {
                            vErrors.push(err144);
                          }
                          errors++;
                        }
                        if (func2(data57) < 1) {
                          const err145 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                          if (vErrors === null) {
                            vErrors = [err145];
                          } else {
                            vErrors.push(err145);
                          }
                          errors++;
                        }
                      } else {
                        const err146 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err146];
                        } else {
                          vErrors.push(err146);
                        }
                        errors++;
                      }
                    }
                    if (data56.version !== void 0) {
                      if (1 !== data56.version) {
                        const err147 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err147];
                        } else {
                          vErrors.push(err147);
                        }
                        errors++;
                      }
                    }
                    if (data56.title !== void 0) {
                      let data59 = data56.title;
                      if (typeof data59 === "string") {
                        if (func2(data59) > 300) {
                          const err148 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/title/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err148];
                          } else {
                            vErrors.push(err148);
                          }
                          errors++;
                        }
                      } else {
                        const err149 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err149];
                        } else {
                          vErrors.push(err149);
                        }
                        errors++;
                      }
                    }
                    if (data56.name !== void 0) {
                      let data60 = data56.name;
                      if (typeof data60 === "string") {
                        if (func2(data60) > 300) {
                          const err150 = { instancePath: instancePath + "/content/" + i0 + "/props/name", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/name/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err150];
                          } else {
                            vErrors.push(err150);
                          }
                          errors++;
                        }
                      } else {
                        const err151 = { instancePath: instancePath + "/content/" + i0 + "/props/name", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/name/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err151];
                        } else {
                          vErrors.push(err151);
                        }
                        errors++;
                      }
                    }
                    if (data56.englishName !== void 0) {
                      let data61 = data56.englishName;
                      if (typeof data61 === "string") {
                        if (func2(data61) > 300) {
                          const err152 = { instancePath: instancePath + "/content/" + i0 + "/props/englishName", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/englishName/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err152];
                          } else {
                            vErrors.push(err152);
                          }
                          errors++;
                        }
                      } else {
                        const err153 = { instancePath: instancePath + "/content/" + i0 + "/props/englishName", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/englishName/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err153];
                        } else {
                          vErrors.push(err153);
                        }
                        errors++;
                      }
                    }
                    if (data56.portraitAlt !== void 0) {
                      let data62 = data56.portraitAlt;
                      if (typeof data62 === "string") {
                        if (func2(data62) > 300) {
                          const err154 = { instancePath: instancePath + "/content/" + i0 + "/props/portraitAlt", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/portraitAlt/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err154];
                          } else {
                            vErrors.push(err154);
                          }
                          errors++;
                        }
                      } else {
                        const err155 = { instancePath: instancePath + "/content/" + i0 + "/props/portraitAlt", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/portraitAlt/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err155];
                        } else {
                          vErrors.push(err155);
                        }
                        errors++;
                      }
                    }
                    if (data56.company !== void 0) {
                      let data63 = data56.company;
                      if (typeof data63 === "string") {
                        if (func2(data63) > 300) {
                          const err156 = { instancePath: instancePath + "/content/" + i0 + "/props/company", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/company/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err156];
                          } else {
                            vErrors.push(err156);
                          }
                          errors++;
                        }
                      } else {
                        const err157 = { instancePath: instancePath + "/content/" + i0 + "/props/company", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/company/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err157];
                        } else {
                          vErrors.push(err157);
                        }
                        errors++;
                      }
                    }
                    if (data56.role !== void 0) {
                      let data64 = data56.role;
                      if (typeof data64 === "string") {
                        if (func2(data64) > 300) {
                          const err158 = { instancePath: instancePath + "/content/" + i0 + "/props/role", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/role/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err158];
                          } else {
                            vErrors.push(err158);
                          }
                          errors++;
                        }
                      } else {
                        const err159 = { instancePath: instancePath + "/content/" + i0 + "/props/role", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/role/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err159];
                        } else {
                          vErrors.push(err159);
                        }
                        errors++;
                      }
                    }
                    if (data56.period !== void 0) {
                      let data65 = data56.period;
                      if (typeof data65 === "string") {
                        if (func2(data65) > 300) {
                          const err160 = { instancePath: instancePath + "/content/" + i0 + "/props/period", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/period/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                          if (vErrors === null) {
                            vErrors = [err160];
                          } else {
                            vErrors.push(err160);
                          }
                          errors++;
                        }
                      } else {
                        const err161 = { instancePath: instancePath + "/content/" + i0 + "/props/period", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/period/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err161];
                        } else {
                          vErrors.push(err161);
                        }
                        errors++;
                      }
                    }
                    if (data56.portrait !== void 0) {
                      let data66 = data56.portrait;
                      if (typeof data66 === "string") {
                        if (func2(data66) > 500) {
                          const err162 = { instancePath: instancePath + "/content/" + i0 + "/props/portrait", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/portrait/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                          if (vErrors === null) {
                            vErrors = [err162];
                          } else {
                            vErrors.push(err162);
                          }
                          errors++;
                        }
                        if (!pattern2.test(data66)) {
                          const err163 = { instancePath: instancePath + "/content/" + i0 + "/props/portrait", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/portrait/pattern", keyword: "pattern", params: { pattern: "^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$" }, message: 'must match pattern "^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$"' };
                          if (vErrors === null) {
                            vErrors = [err163];
                          } else {
                            vErrors.push(err163);
                          }
                          errors++;
                        }
                      } else {
                        const err164 = { instancePath: instancePath + "/content/" + i0 + "/props/portrait", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/portrait/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err164];
                        } else {
                          vErrors.push(err164);
                        }
                        errors++;
                      }
                    }
                    if (data56.summary !== void 0) {
                      let data67 = data56.summary;
                      if (typeof data67 === "string") {
                        if (func2(data67) > 3e3) {
                          const err165 = { instancePath: instancePath + "/content/" + i0 + "/props/summary", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/summary/maxLength", keyword: "maxLength", params: { limit: 3e3 }, message: "must NOT have more than 3000 characters" };
                          if (vErrors === null) {
                            vErrors = [err165];
                          } else {
                            vErrors.push(err165);
                          }
                          errors++;
                        }
                      } else {
                        const err166 = { instancePath: instancePath + "/content/" + i0 + "/props/summary", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/summary/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                        if (vErrors === null) {
                          vErrors = [err166];
                        } else {
                          vErrors.push(err166);
                        }
                        errors++;
                      }
                    }
                    if (data56.facts !== void 0) {
                      let data68 = data56.facts;
                      if (Array.isArray(data68)) {
                        if (data68.length > 12) {
                          const err167 = { instancePath: instancePath + "/content/" + i0 + "/props/facts", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/maxItems", keyword: "maxItems", params: { limit: 12 }, message: "must NOT have more than 12 items" };
                          if (vErrors === null) {
                            vErrors = [err167];
                          } else {
                            vErrors.push(err167);
                          }
                          errors++;
                        }
                        const len2 = data68.length;
                        for (let i2 = 0; i2 < len2; i2++) {
                          let data69 = data68[i2];
                          if (data69 && typeof data69 == "object" && !Array.isArray(data69)) {
                            if (data69.label === void 0) {
                              const err168 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/required", keyword: "required", params: { missingProperty: "label" }, message: "must have required property 'label'" };
                              if (vErrors === null) {
                                vErrors = [err168];
                              } else {
                                vErrors.push(err168);
                              }
                              errors++;
                            }
                            if (data69.value === void 0) {
                              const err169 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/required", keyword: "required", params: { missingProperty: "value" }, message: "must have required property 'value'" };
                              if (vErrors === null) {
                                vErrors = [err169];
                              } else {
                                vErrors.push(err169);
                              }
                              errors++;
                            }
                            for (const key16 in data69) {
                              if (!(key16 === "label" || key16 === "value")) {
                                const err170 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key16 }, message: "must NOT have additional properties" };
                                if (vErrors === null) {
                                  vErrors = [err170];
                                } else {
                                  vErrors.push(err170);
                                }
                                errors++;
                              }
                            }
                            if (data69.label !== void 0) {
                              let data70 = data69.label;
                              if (typeof data70 === "string") {
                                if (func2(data70) > 1e3) {
                                  const err171 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2 + "/label", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/properties/label/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err171];
                                  } else {
                                    vErrors.push(err171);
                                  }
                                  errors++;
                                }
                              } else {
                                const err172 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2 + "/label", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/properties/label/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err172];
                                } else {
                                  vErrors.push(err172);
                                }
                                errors++;
                              }
                            }
                            if (data69.value !== void 0) {
                              let data71 = data69.value;
                              if (typeof data71 === "string") {
                                if (func2(data71) > 1e3) {
                                  const err173 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2 + "/value", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/properties/value/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err173];
                                  } else {
                                    vErrors.push(err173);
                                  }
                                  errors++;
                                }
                              } else {
                                const err174 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2 + "/value", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/properties/value/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err174];
                                } else {
                                  vErrors.push(err174);
                                }
                                errors++;
                              }
                            }
                          } else {
                            const err175 = { instancePath: instancePath + "/content/" + i0 + "/props/facts/" + i2, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err175];
                            } else {
                              vErrors.push(err175);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err176 = { instancePath: instancePath + "/content/" + i0 + "/props/facts", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/facts/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err176];
                        } else {
                          vErrors.push(err176);
                        }
                        errors++;
                      }
                    }
                    if (data56.achievements !== void 0) {
                      let data72 = data56.achievements;
                      if (Array.isArray(data72)) {
                        if (data72.length > 12) {
                          const err177 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/maxItems", keyword: "maxItems", params: { limit: 12 }, message: "must NOT have more than 12 items" };
                          if (vErrors === null) {
                            vErrors = [err177];
                          } else {
                            vErrors.push(err177);
                          }
                          errors++;
                        }
                        const len3 = data72.length;
                        for (let i3 = 0; i3 < len3; i3++) {
                          let data73 = data72[i3];
                          if (data73 && typeof data73 == "object" && !Array.isArray(data73)) {
                            if (data73.title === void 0) {
                              const err178 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/required", keyword: "required", params: { missingProperty: "title" }, message: "must have required property 'title'" };
                              if (vErrors === null) {
                                vErrors = [err178];
                              } else {
                                vErrors.push(err178);
                              }
                              errors++;
                            }
                            if (data73.description === void 0) {
                              const err179 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/required", keyword: "required", params: { missingProperty: "description" }, message: "must have required property 'description'" };
                              if (vErrors === null) {
                                vErrors = [err179];
                              } else {
                                vErrors.push(err179);
                              }
                              errors++;
                            }
                            for (const key17 in data73) {
                              if (!(key17 === "title" || key17 === "description")) {
                                const err180 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key17 }, message: "must NOT have additional properties" };
                                if (vErrors === null) {
                                  vErrors = [err180];
                                } else {
                                  vErrors.push(err180);
                                }
                                errors++;
                              }
                            }
                            if (data73.title !== void 0) {
                              let data74 = data73.title;
                              if (typeof data74 === "string") {
                                if (func2(data74) > 1e3) {
                                  const err181 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3 + "/title", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/properties/title/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err181];
                                  } else {
                                    vErrors.push(err181);
                                  }
                                  errors++;
                                }
                              } else {
                                const err182 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3 + "/title", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err182];
                                } else {
                                  vErrors.push(err182);
                                }
                                errors++;
                              }
                            }
                            if (data73.description !== void 0) {
                              let data75 = data73.description;
                              if (typeof data75 === "string") {
                                if (func2(data75) > 1e3) {
                                  const err183 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3 + "/description", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/properties/description/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err183];
                                  } else {
                                    vErrors.push(err183);
                                  }
                                  errors++;
                                }
                              } else {
                                const err184 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3 + "/description", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/properties/description/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err184];
                                } else {
                                  vErrors.push(err184);
                                }
                                errors++;
                              }
                            }
                          } else {
                            const err185 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements/" + i3, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err185];
                            } else {
                              vErrors.push(err185);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err186 = { instancePath: instancePath + "/content/" + i0 + "/props/achievements", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/achievements/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err186];
                        } else {
                          vErrors.push(err186);
                        }
                        errors++;
                      }
                    }
                    if (data56.education !== void 0) {
                      let data76 = data56.education;
                      if (Array.isArray(data76)) {
                        if (data76.length > 8) {
                          const err187 = { instancePath: instancePath + "/content/" + i0 + "/props/education", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" };
                          if (vErrors === null) {
                            vErrors = [err187];
                          } else {
                            vErrors.push(err187);
                          }
                          errors++;
                        }
                        const len4 = data76.length;
                        for (let i4 = 0; i4 < len4; i4++) {
                          let data77 = data76[i4];
                          if (data77 && typeof data77 == "object" && !Array.isArray(data77)) {
                            if (data77.school === void 0) {
                              const err188 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/required", keyword: "required", params: { missingProperty: "school" }, message: "must have required property 'school'" };
                              if (vErrors === null) {
                                vErrors = [err188];
                              } else {
                                vErrors.push(err188);
                              }
                              errors++;
                            }
                            if (data77.qualification === void 0) {
                              const err189 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/required", keyword: "required", params: { missingProperty: "qualification" }, message: "must have required property 'qualification'" };
                              if (vErrors === null) {
                                vErrors = [err189];
                              } else {
                                vErrors.push(err189);
                              }
                              errors++;
                            }
                            if (data77.major === void 0) {
                              const err190 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/required", keyword: "required", params: { missingProperty: "major" }, message: "must have required property 'major'" };
                              if (vErrors === null) {
                                vErrors = [err190];
                              } else {
                                vErrors.push(err190);
                              }
                              errors++;
                            }
                            if (data77.period === void 0) {
                              const err191 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/required", keyword: "required", params: { missingProperty: "period" }, message: "must have required property 'period'" };
                              if (vErrors === null) {
                                vErrors = [err191];
                              } else {
                                vErrors.push(err191);
                              }
                              errors++;
                            }
                            for (const key18 in data77) {
                              if (!(key18 === "school" || key18 === "qualification" || key18 === "major" || key18 === "period")) {
                                const err192 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key18 }, message: "must NOT have additional properties" };
                                if (vErrors === null) {
                                  vErrors = [err192];
                                } else {
                                  vErrors.push(err192);
                                }
                                errors++;
                              }
                            }
                            if (data77.school !== void 0) {
                              let data78 = data77.school;
                              if (typeof data78 === "string") {
                                if (func2(data78) > 1e3) {
                                  const err193 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/school", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/school/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err193];
                                  } else {
                                    vErrors.push(err193);
                                  }
                                  errors++;
                                }
                              } else {
                                const err194 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/school", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/school/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err194];
                                } else {
                                  vErrors.push(err194);
                                }
                                errors++;
                              }
                            }
                            if (data77.qualification !== void 0) {
                              let data79 = data77.qualification;
                              if (typeof data79 === "string") {
                                if (func2(data79) > 1e3) {
                                  const err195 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/qualification", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/qualification/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err195];
                                  } else {
                                    vErrors.push(err195);
                                  }
                                  errors++;
                                }
                              } else {
                                const err196 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/qualification", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/qualification/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err196];
                                } else {
                                  vErrors.push(err196);
                                }
                                errors++;
                              }
                            }
                            if (data77.major !== void 0) {
                              let data80 = data77.major;
                              if (typeof data80 === "string") {
                                if (func2(data80) > 1e3) {
                                  const err197 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/major", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/major/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err197];
                                  } else {
                                    vErrors.push(err197);
                                  }
                                  errors++;
                                }
                              } else {
                                const err198 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/major", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/major/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err198];
                                } else {
                                  vErrors.push(err198);
                                }
                                errors++;
                              }
                            }
                            if (data77.period !== void 0) {
                              let data81 = data77.period;
                              if (typeof data81 === "string") {
                                if (func2(data81) > 1e3) {
                                  const err199 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/period", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/period/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err199];
                                  } else {
                                    vErrors.push(err199);
                                  }
                                  errors++;
                                }
                              } else {
                                const err200 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4 + "/period", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/properties/period/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err200];
                                } else {
                                  vErrors.push(err200);
                                }
                                errors++;
                              }
                            }
                          } else {
                            const err201 = { instancePath: instancePath + "/content/" + i0 + "/props/education/" + i4, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err201];
                            } else {
                              vErrors.push(err201);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err202 = { instancePath: instancePath + "/content/" + i0 + "/props/education", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/education/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err202];
                        } else {
                          vErrors.push(err202);
                        }
                        errors++;
                      }
                    }
                    if (data56.skills !== void 0) {
                      let data82 = data56.skills;
                      if (Array.isArray(data82)) {
                        if (data82.length > 20) {
                          const err203 = { instancePath: instancePath + "/content/" + i0 + "/props/skills", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/maxItems", keyword: "maxItems", params: { limit: 20 }, message: "must NOT have more than 20 items" };
                          if (vErrors === null) {
                            vErrors = [err203];
                          } else {
                            vErrors.push(err203);
                          }
                          errors++;
                        }
                        const len5 = data82.length;
                        for (let i5 = 0; i5 < len5; i5++) {
                          let data83 = data82[i5];
                          if (data83 && typeof data83 == "object" && !Array.isArray(data83)) {
                            if (data83.label === void 0) {
                              const err204 = { instancePath: instancePath + "/content/" + i0 + "/props/skills/" + i5, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/items/required", keyword: "required", params: { missingProperty: "label" }, message: "must have required property 'label'" };
                              if (vErrors === null) {
                                vErrors = [err204];
                              } else {
                                vErrors.push(err204);
                              }
                              errors++;
                            }
                            for (const key19 in data83) {
                              if (!(key19 === "label")) {
                                const err205 = { instancePath: instancePath + "/content/" + i0 + "/props/skills/" + i5, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key19 }, message: "must NOT have additional properties" };
                                if (vErrors === null) {
                                  vErrors = [err205];
                                } else {
                                  vErrors.push(err205);
                                }
                                errors++;
                              }
                            }
                            if (data83.label !== void 0) {
                              let data84 = data83.label;
                              if (typeof data84 === "string") {
                                if (func2(data84) > 1e3) {
                                  const err206 = { instancePath: instancePath + "/content/" + i0 + "/props/skills/" + i5 + "/label", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/items/properties/label/maxLength", keyword: "maxLength", params: { limit: 1e3 }, message: "must NOT have more than 1000 characters" };
                                  if (vErrors === null) {
                                    vErrors = [err206];
                                  } else {
                                    vErrors.push(err206);
                                  }
                                  errors++;
                                }
                              } else {
                                const err207 = { instancePath: instancePath + "/content/" + i0 + "/props/skills/" + i5 + "/label", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/items/properties/label/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                if (vErrors === null) {
                                  vErrors = [err207];
                                } else {
                                  vErrors.push(err207);
                                }
                                errors++;
                              }
                            }
                          } else {
                            const err208 = { instancePath: instancePath + "/content/" + i0 + "/props/skills/" + i5, schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                            if (vErrors === null) {
                              vErrors = [err208];
                            } else {
                              vErrors.push(err208);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err209 = { instancePath: instancePath + "/content/" + i0 + "/props/skills", schemaPath: "#/properties/content/items/oneOf/3/properties/props/properties/skills/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                        if (vErrors === null) {
                          vErrors = [err209];
                        } else {
                          vErrors.push(err209);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err210 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/3/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err210];
                    } else {
                      vErrors.push(err210);
                    }
                    errors++;
                  }
                }
                if (data6.readOnly !== void 0) {
                  let data85 = data6.readOnly;
                  if (data85 && typeof data85 == "object" && !Array.isArray(data85)) {
                    for (const key20 in data85) {
                      if (!func8.call(schema11.properties.content.items.oneOf[3].properties.readOnly.properties, key20)) {
                        const err211 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key20 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err211];
                        } else {
                          vErrors.push(err211);
                        }
                        errors++;
                      }
                    }
                    if (data85.id !== void 0) {
                      if (typeof data85.id !== "boolean") {
                        const err212 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err212];
                        } else {
                          vErrors.push(err212);
                        }
                        errors++;
                      }
                    }
                    if (data85.version !== void 0) {
                      if (typeof data85.version !== "boolean") {
                        const err213 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err213];
                        } else {
                          vErrors.push(err213);
                        }
                        errors++;
                      }
                    }
                    if (data85.title !== void 0) {
                      if (typeof data85.title !== "boolean") {
                        const err214 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/title", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/title/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err214];
                        } else {
                          vErrors.push(err214);
                        }
                        errors++;
                      }
                    }
                    if (data85.name !== void 0) {
                      if (typeof data85.name !== "boolean") {
                        const err215 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/name", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/name/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err215];
                        } else {
                          vErrors.push(err215);
                        }
                        errors++;
                      }
                    }
                    if (data85.englishName !== void 0) {
                      if (typeof data85.englishName !== "boolean") {
                        const err216 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/englishName", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/englishName/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err216];
                        } else {
                          vErrors.push(err216);
                        }
                        errors++;
                      }
                    }
                    if (data85.portraitAlt !== void 0) {
                      if (typeof data85.portraitAlt !== "boolean") {
                        const err217 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/portraitAlt", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/portraitAlt/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err217];
                        } else {
                          vErrors.push(err217);
                        }
                        errors++;
                      }
                    }
                    if (data85.company !== void 0) {
                      if (typeof data85.company !== "boolean") {
                        const err218 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/company", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/company/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err218];
                        } else {
                          vErrors.push(err218);
                        }
                        errors++;
                      }
                    }
                    if (data85.role !== void 0) {
                      if (typeof data85.role !== "boolean") {
                        const err219 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/role", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/role/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err219];
                        } else {
                          vErrors.push(err219);
                        }
                        errors++;
                      }
                    }
                    if (data85.period !== void 0) {
                      if (typeof data85.period !== "boolean") {
                        const err220 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/period", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/period/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err220];
                        } else {
                          vErrors.push(err220);
                        }
                        errors++;
                      }
                    }
                    if (data85.portrait !== void 0) {
                      if (typeof data85.portrait !== "boolean") {
                        const err221 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/portrait", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/portrait/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err221];
                        } else {
                          vErrors.push(err221);
                        }
                        errors++;
                      }
                    }
                    if (data85.summary !== void 0) {
                      if (typeof data85.summary !== "boolean") {
                        const err222 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/summary", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/summary/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err222];
                        } else {
                          vErrors.push(err222);
                        }
                        errors++;
                      }
                    }
                    if (data85.facts !== void 0) {
                      if (typeof data85.facts !== "boolean") {
                        const err223 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/facts", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/facts/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err223];
                        } else {
                          vErrors.push(err223);
                        }
                        errors++;
                      }
                    }
                    if (data85.achievements !== void 0) {
                      if (typeof data85.achievements !== "boolean") {
                        const err224 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/achievements", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/achievements/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err224];
                        } else {
                          vErrors.push(err224);
                        }
                        errors++;
                      }
                    }
                    if (data85.education !== void 0) {
                      if (typeof data85.education !== "boolean") {
                        const err225 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/education", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/education/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err225];
                        } else {
                          vErrors.push(err225);
                        }
                        errors++;
                      }
                    }
                    if (data85.skills !== void 0) {
                      if (typeof data85.skills !== "boolean") {
                        const err226 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/skills", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/properties/skills/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                        if (vErrors === null) {
                          vErrors = [err226];
                        } else {
                          vErrors.push(err226);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err227 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/3/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err227];
                    } else {
                      vErrors.push(err227);
                    }
                    errors++;
                  }
                }
              } else {
                const err228 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/3/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                if (vErrors === null) {
                  vErrors = [err228];
                } else {
                  vErrors.push(err228);
                }
                errors++;
              }
              var _valid0 = _errs124 === errors;
              if (_valid0 && valid6) {
                valid6 = false;
                passing0 = [passing0, 3];
              } else {
                if (_valid0) {
                  valid6 = true;
                  passing0 = 3;
                }
                const _errs223 = errors;
                if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                  if (data6.type === void 0) {
                    const err229 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/4/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
                    if (vErrors === null) {
                      vErrors = [err229];
                    } else {
                      vErrors.push(err229);
                    }
                    errors++;
                  }
                  if (data6.props === void 0) {
                    const err230 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/4/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
                    if (vErrors === null) {
                      vErrors = [err230];
                    } else {
                      vErrors.push(err230);
                    }
                    errors++;
                  }
                  for (const key21 in data6) {
                    if (!(key21 === "type" || key21 === "props" || key21 === "readOnly")) {
                      const err231 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/4/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key21 }, message: "must NOT have additional properties" };
                      if (vErrors === null) {
                        vErrors = [err231];
                      } else {
                        vErrors.push(err231);
                      }
                      errors++;
                    }
                  }
                  if (data6.type !== void 0) {
                    if ("Contents" !== data6.type) {
                      const err232 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/4/properties/type/const", keyword: "const", params: { allowedValue: "Contents" }, message: "must be equal to constant" };
                      if (vErrors === null) {
                        vErrors = [err232];
                      } else {
                        vErrors.push(err232);
                      }
                      errors++;
                    }
                  }
                  if (data6.props !== void 0) {
                    let data102 = data6.props;
                    if (data102 && typeof data102 == "object" && !Array.isArray(data102)) {
                      if (data102.id === void 0) {
                        const err233 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                        if (vErrors === null) {
                          vErrors = [err233];
                        } else {
                          vErrors.push(err233);
                        }
                        errors++;
                      }
                      if (data102.version === void 0) {
                        const err234 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                        if (vErrors === null) {
                          vErrors = [err234];
                        } else {
                          vErrors.push(err234);
                        }
                        errors++;
                      }
                      if (data102.title === void 0) {
                        const err235 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/required", keyword: "required", params: { missingProperty: "title" }, message: "must have required property 'title'" };
                        if (vErrors === null) {
                          vErrors = [err235];
                        } else {
                          vErrors.push(err235);
                        }
                        errors++;
                      }
                      if (data102.subtitle === void 0) {
                        const err236 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/required", keyword: "required", params: { missingProperty: "subtitle" }, message: "must have required property 'subtitle'" };
                        if (vErrors === null) {
                          vErrors = [err236];
                        } else {
                          vErrors.push(err236);
                        }
                        errors++;
                      }
                      if (data102.items === void 0) {
                        const err237 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/required", keyword: "required", params: { missingProperty: "items" }, message: "must have required property 'items'" };
                        if (vErrors === null) {
                          vErrors = [err237];
                        } else {
                          vErrors.push(err237);
                        }
                        errors++;
                      }
                      for (const key22 in data102) {
                        if (!(key22 === "id" || key22 === "version" || key22 === "title" || key22 === "subtitle" || key22 === "items")) {
                          const err238 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key22 }, message: "must NOT have additional properties" };
                          if (vErrors === null) {
                            vErrors = [err238];
                          } else {
                            vErrors.push(err238);
                          }
                          errors++;
                        }
                      }
                      if (data102.id !== void 0) {
                        let data103 = data102.id;
                        if (typeof data103 === "string") {
                          if (func2(data103) > 100) {
                            const err239 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                            if (vErrors === null) {
                              vErrors = [err239];
                            } else {
                              vErrors.push(err239);
                            }
                            errors++;
                          }
                          if (func2(data103) < 1) {
                            const err240 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                            if (vErrors === null) {
                              vErrors = [err240];
                            } else {
                              vErrors.push(err240);
                            }
                            errors++;
                          }
                        } else {
                          const err241 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err241];
                          } else {
                            vErrors.push(err241);
                          }
                          errors++;
                        }
                      }
                      if (data102.version !== void 0) {
                        if (1 !== data102.version) {
                          const err242 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err242];
                          } else {
                            vErrors.push(err242);
                          }
                          errors++;
                        }
                      }
                      if (data102.title !== void 0) {
                        let data105 = data102.title;
                        if (typeof data105 === "string") {
                          if (func2(data105) > 300) {
                            const err243 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/title/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                            if (vErrors === null) {
                              vErrors = [err243];
                            } else {
                              vErrors.push(err243);
                            }
                            errors++;
                          }
                        } else {
                          const err244 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err244];
                          } else {
                            vErrors.push(err244);
                          }
                          errors++;
                        }
                      }
                      if (data102.subtitle !== void 0) {
                        let data106 = data102.subtitle;
                        if (typeof data106 === "string") {
                          if (func2(data106) > 300) {
                            const err245 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/subtitle/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                            if (vErrors === null) {
                              vErrors = [err245];
                            } else {
                              vErrors.push(err245);
                            }
                            errors++;
                          }
                        } else {
                          const err246 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/subtitle/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                          if (vErrors === null) {
                            vErrors = [err246];
                          } else {
                            vErrors.push(err246);
                          }
                          errors++;
                        }
                      }
                      if (data102.items !== void 0) {
                        let data107 = data102.items;
                        if (Array.isArray(data107)) {
                          if (data107.length > 4) {
                            const err247 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/maxItems", keyword: "maxItems", params: { limit: 4 }, message: "must NOT have more than 4 items" };
                            if (vErrors === null) {
                              vErrors = [err247];
                            } else {
                              vErrors.push(err247);
                            }
                            errors++;
                          }
                          const len6 = data107.length;
                          for (let i6 = 0; i6 < len6; i6++) {
                            let data108 = data107[i6];
                            if (data108 && typeof data108 == "object" && !Array.isArray(data108)) {
                              if (data108.letter === void 0) {
                                const err248 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "letter" }, message: "must have required property 'letter'" };
                                if (vErrors === null) {
                                  vErrors = [err248];
                                } else {
                                  vErrors.push(err248);
                                }
                                errors++;
                              }
                              if (data108.number === void 0) {
                                const err249 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "number" }, message: "must have required property 'number'" };
                                if (vErrors === null) {
                                  vErrors = [err249];
                                } else {
                                  vErrors.push(err249);
                                }
                                errors++;
                              }
                              if (data108.label === void 0) {
                                const err250 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "label" }, message: "must have required property 'label'" };
                                if (vErrors === null) {
                                  vErrors = [err250];
                                } else {
                                  vErrors.push(err250);
                                }
                                errors++;
                              }
                              if (data108.english === void 0) {
                                const err251 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "english" }, message: "must have required property 'english'" };
                                if (vErrors === null) {
                                  vErrors = [err251];
                                } else {
                                  vErrors.push(err251);
                                }
                                errors++;
                              }
                              if (data108.href === void 0) {
                                const err252 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "href" }, message: "must have required property 'href'" };
                                if (vErrors === null) {
                                  vErrors = [err252];
                                } else {
                                  vErrors.push(err252);
                                }
                                errors++;
                              }
                              for (const key23 in data108) {
                                if (!(key23 === "letter" || key23 === "number" || key23 === "label" || key23 === "english" || key23 === "href")) {
                                  const err253 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key23 }, message: "must NOT have additional properties" };
                                  if (vErrors === null) {
                                    vErrors = [err253];
                                  } else {
                                    vErrors.push(err253);
                                  }
                                  errors++;
                                }
                              }
                              if (data108.letter !== void 0) {
                                let data109 = data108.letter;
                                if (typeof data109 === "string") {
                                  if (func2(data109) > 1) {
                                    const err254 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/letter", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/letter/maxLength", keyword: "maxLength", params: { limit: 1 }, message: "must NOT have more than 1 characters" };
                                    if (vErrors === null) {
                                      vErrors = [err254];
                                    } else {
                                      vErrors.push(err254);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err255 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/letter", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/letter/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err255];
                                  } else {
                                    vErrors.push(err255);
                                  }
                                  errors++;
                                }
                              }
                              if (data108.number !== void 0) {
                                let data110 = data108.number;
                                if (typeof data110 === "string") {
                                  if (func2(data110) > 2) {
                                    const err256 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/number", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/number/maxLength", keyword: "maxLength", params: { limit: 2 }, message: "must NOT have more than 2 characters" };
                                    if (vErrors === null) {
                                      vErrors = [err256];
                                    } else {
                                      vErrors.push(err256);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err257 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/number", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/number/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err257];
                                  } else {
                                    vErrors.push(err257);
                                  }
                                  errors++;
                                }
                              }
                              if (data108.label !== void 0) {
                                let data111 = data108.label;
                                if (typeof data111 === "string") {
                                  if (func2(data111) > 300) {
                                    const err258 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/label", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/label/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                    if (vErrors === null) {
                                      vErrors = [err258];
                                    } else {
                                      vErrors.push(err258);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err259 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/label", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/label/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err259];
                                  } else {
                                    vErrors.push(err259);
                                  }
                                  errors++;
                                }
                              }
                              if (data108.english !== void 0) {
                                let data112 = data108.english;
                                if (typeof data112 === "string") {
                                  if (func2(data112) > 300) {
                                    const err260 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/english", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/english/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                    if (vErrors === null) {
                                      vErrors = [err260];
                                    } else {
                                      vErrors.push(err260);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err261 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/english", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/english/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err261];
                                  } else {
                                    vErrors.push(err261);
                                  }
                                  errors++;
                                }
                              }
                              if (data108.href !== void 0) {
                                let data113 = data108.href;
                                if (typeof data113 === "string") {
                                  if (func2(data113) > 500) {
                                    const err262 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/href", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/href/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                                    if (vErrors === null) {
                                      vErrors = [err262];
                                    } else {
                                      vErrors.push(err262);
                                    }
                                    errors++;
                                  }
                                  if (!pattern0.test(data113)) {
                                    const err263 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/href", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/href/pattern", keyword: "pattern", params: { pattern: "^(#|/[^/]|https://|$)" }, message: 'must match pattern "^(#|/[^/]|https://|$)"' };
                                    if (vErrors === null) {
                                      vErrors = [err263];
                                    } else {
                                      vErrors.push(err263);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err264 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6 + "/href", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/properties/href/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                  if (vErrors === null) {
                                    vErrors = [err264];
                                  } else {
                                    vErrors.push(err264);
                                  }
                                  errors++;
                                }
                              }
                            } else {
                              const err265 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i6, schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                              if (vErrors === null) {
                                vErrors = [err265];
                              } else {
                                vErrors.push(err265);
                              }
                              errors++;
                            }
                          }
                        } else {
                          const err266 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/4/properties/props/properties/items/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                          if (vErrors === null) {
                            vErrors = [err266];
                          } else {
                            vErrors.push(err266);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err267 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/4/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                      if (vErrors === null) {
                        vErrors = [err267];
                      } else {
                        vErrors.push(err267);
                      }
                      errors++;
                    }
                  }
                  if (data6.readOnly !== void 0) {
                    let data114 = data6.readOnly;
                    if (data114 && typeof data114 == "object" && !Array.isArray(data114)) {
                      for (const key24 in data114) {
                        if (!(key24 === "id" || key24 === "version" || key24 === "title" || key24 === "subtitle" || key24 === "items")) {
                          const err268 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key24 }, message: "must NOT have additional properties" };
                          if (vErrors === null) {
                            vErrors = [err268];
                          } else {
                            vErrors.push(err268);
                          }
                          errors++;
                        }
                      }
                      if (data114.id !== void 0) {
                        if (typeof data114.id !== "boolean") {
                          const err269 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                          if (vErrors === null) {
                            vErrors = [err269];
                          } else {
                            vErrors.push(err269);
                          }
                          errors++;
                        }
                      }
                      if (data114.version !== void 0) {
                        if (typeof data114.version !== "boolean") {
                          const err270 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                          if (vErrors === null) {
                            vErrors = [err270];
                          } else {
                            vErrors.push(err270);
                          }
                          errors++;
                        }
                      }
                      if (data114.title !== void 0) {
                        if (typeof data114.title !== "boolean") {
                          const err271 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/title", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/properties/title/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                          if (vErrors === null) {
                            vErrors = [err271];
                          } else {
                            vErrors.push(err271);
                          }
                          errors++;
                        }
                      }
                      if (data114.subtitle !== void 0) {
                        if (typeof data114.subtitle !== "boolean") {
                          const err272 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/subtitle", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/properties/subtitle/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                          if (vErrors === null) {
                            vErrors = [err272];
                          } else {
                            vErrors.push(err272);
                          }
                          errors++;
                        }
                      }
                      if (data114.items !== void 0) {
                        if (typeof data114.items !== "boolean") {
                          const err273 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/items", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/properties/items/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                          if (vErrors === null) {
                            vErrors = [err273];
                          } else {
                            vErrors.push(err273);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err274 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/4/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                      if (vErrors === null) {
                        vErrors = [err274];
                      } else {
                        vErrors.push(err274);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err275 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/4/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                  if (vErrors === null) {
                    vErrors = [err275];
                  } else {
                    vErrors.push(err275);
                  }
                  errors++;
                }
                var _valid0 = _errs223 === errors;
                if (_valid0 && valid6) {
                  valid6 = false;
                  passing0 = [passing0, 4];
                } else {
                  if (_valid0) {
                    valid6 = true;
                    passing0 = 4;
                  }
                  const _errs265 = errors;
                  if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                    if (data6.type === void 0) {
                      const err276 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/5/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
                      if (vErrors === null) {
                        vErrors = [err276];
                      } else {
                        vErrors.push(err276);
                      }
                      errors++;
                    }
                    if (data6.props === void 0) {
                      const err277 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/5/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
                      if (vErrors === null) {
                        vErrors = [err277];
                      } else {
                        vErrors.push(err277);
                      }
                      errors++;
                    }
                    for (const key25 in data6) {
                      if (!(key25 === "type" || key25 === "props" || key25 === "readOnly")) {
                        const err278 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/5/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key25 }, message: "must NOT have additional properties" };
                        if (vErrors === null) {
                          vErrors = [err278];
                        } else {
                          vErrors.push(err278);
                        }
                        errors++;
                      }
                    }
                    if (data6.type !== void 0) {
                      if ("Closing" !== data6.type) {
                        const err279 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/5/properties/type/const", keyword: "const", params: { allowedValue: "Closing" }, message: "must be equal to constant" };
                        if (vErrors === null) {
                          vErrors = [err279];
                        } else {
                          vErrors.push(err279);
                        }
                        errors++;
                      }
                    }
                    if (data6.props !== void 0) {
                      let data121 = data6.props;
                      if (data121 && typeof data121 == "object" && !Array.isArray(data121)) {
                        if (data121.id === void 0) {
                          const err280 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                          if (vErrors === null) {
                            vErrors = [err280];
                          } else {
                            vErrors.push(err280);
                          }
                          errors++;
                        }
                        if (data121.version === void 0) {
                          const err281 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                          if (vErrors === null) {
                            vErrors = [err281];
                          } else {
                            vErrors.push(err281);
                          }
                          errors++;
                        }
                        if (data121.brand === void 0) {
                          const err282 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "brand" }, message: "must have required property 'brand'" };
                          if (vErrors === null) {
                            vErrors = [err282];
                          } else {
                            vErrors.push(err282);
                          }
                          errors++;
                        }
                        if (data121.items === void 0) {
                          const err283 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "items" }, message: "must have required property 'items'" };
                          if (vErrors === null) {
                            vErrors = [err283];
                          } else {
                            vErrors.push(err283);
                          }
                          errors++;
                        }
                        if (data121.motto === void 0) {
                          const err284 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "motto" }, message: "must have required property 'motto'" };
                          if (vErrors === null) {
                            vErrors = [err284];
                          } else {
                            vErrors.push(err284);
                          }
                          errors++;
                        }
                        if (data121.title === void 0) {
                          const err285 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "title" }, message: "must have required property 'title'" };
                          if (vErrors === null) {
                            vErrors = [err285];
                          } else {
                            vErrors.push(err285);
                          }
                          errors++;
                        }
                        if (data121.subtitle === void 0) {
                          const err286 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "subtitle" }, message: "must have required property 'subtitle'" };
                          if (vErrors === null) {
                            vErrors = [err286];
                          } else {
                            vErrors.push(err286);
                          }
                          errors++;
                        }
                        if (data121.wish === void 0) {
                          const err287 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "wish" }, message: "must have required property 'wish'" };
                          if (vErrors === null) {
                            vErrors = [err287];
                          } else {
                            vErrors.push(err287);
                          }
                          errors++;
                        }
                        if (data121.welcome === void 0) {
                          const err288 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "welcome" }, message: "must have required property 'welcome'" };
                          if (vErrors === null) {
                            vErrors = [err288];
                          } else {
                            vErrors.push(err288);
                          }
                          errors++;
                        }
                        if (data121.learning === void 0) {
                          const err289 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "learning" }, message: "must have required property 'learning'" };
                          if (vErrors === null) {
                            vErrors = [err289];
                          } else {
                            vErrors.push(err289);
                          }
                          errors++;
                        }
                        if (data121.years === void 0) {
                          const err290 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "years" }, message: "must have required property 'years'" };
                          if (vErrors === null) {
                            vErrors = [err290];
                          } else {
                            vErrors.push(err290);
                          }
                          errors++;
                        }
                        if (data121.category === void 0) {
                          const err291 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/required", keyword: "required", params: { missingProperty: "category" }, message: "must have required property 'category'" };
                          if (vErrors === null) {
                            vErrors = [err291];
                          } else {
                            vErrors.push(err291);
                          }
                          errors++;
                        }
                        for (const key26 in data121) {
                          if (!func8.call(schema11.properties.content.items.oneOf[5].properties.props.properties, key26)) {
                            const err292 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key26 }, message: "must NOT have additional properties" };
                            if (vErrors === null) {
                              vErrors = [err292];
                            } else {
                              vErrors.push(err292);
                            }
                            errors++;
                          }
                        }
                        if (data121.id !== void 0) {
                          let data122 = data121.id;
                          if (typeof data122 === "string") {
                            if (func2(data122) > 100) {
                              const err293 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                              if (vErrors === null) {
                                vErrors = [err293];
                              } else {
                                vErrors.push(err293);
                              }
                              errors++;
                            }
                            if (func2(data122) < 1) {
                              const err294 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                              if (vErrors === null) {
                                vErrors = [err294];
                              } else {
                                vErrors.push(err294);
                              }
                              errors++;
                            }
                          } else {
                            const err295 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err295];
                            } else {
                              vErrors.push(err295);
                            }
                            errors++;
                          }
                        }
                        if (data121.version !== void 0) {
                          if (1 !== data121.version) {
                            const err296 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                            if (vErrors === null) {
                              vErrors = [err296];
                            } else {
                              vErrors.push(err296);
                            }
                            errors++;
                          }
                        }
                        if (data121.brand !== void 0) {
                          let data124 = data121.brand;
                          if (typeof data124 === "string") {
                            if (func2(data124) > 300) {
                              const err297 = { instancePath: instancePath + "/content/" + i0 + "/props/brand", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/brand/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err297];
                              } else {
                                vErrors.push(err297);
                              }
                              errors++;
                            }
                          } else {
                            const err298 = { instancePath: instancePath + "/content/" + i0 + "/props/brand", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/brand/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err298];
                            } else {
                              vErrors.push(err298);
                            }
                            errors++;
                          }
                        }
                        if (data121.items !== void 0) {
                          let data125 = data121.items;
                          if (Array.isArray(data125)) {
                            if (data125.length > 8) {
                              const err299 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/maxItems", keyword: "maxItems", params: { limit: 8 }, message: "must NOT have more than 8 items" };
                              if (vErrors === null) {
                                vErrors = [err299];
                              } else {
                                vErrors.push(err299);
                              }
                              errors++;
                            }
                            const len7 = data125.length;
                            for (let i7 = 0; i7 < len7; i7++) {
                              let data126 = data125[i7];
                              if (data126 && typeof data126 == "object" && !Array.isArray(data126)) {
                                if (data126.label === void 0) {
                                  const err300 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7, schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "label" }, message: "must have required property 'label'" };
                                  if (vErrors === null) {
                                    vErrors = [err300];
                                  } else {
                                    vErrors.push(err300);
                                  }
                                  errors++;
                                }
                                if (data126.href === void 0) {
                                  const err301 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7, schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "href" }, message: "must have required property 'href'" };
                                  if (vErrors === null) {
                                    vErrors = [err301];
                                  } else {
                                    vErrors.push(err301);
                                  }
                                  errors++;
                                }
                                for (const key27 in data126) {
                                  if (!(key27 === "label" || key27 === "href")) {
                                    const err302 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7, schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key27 }, message: "must NOT have additional properties" };
                                    if (vErrors === null) {
                                      vErrors = [err302];
                                    } else {
                                      vErrors.push(err302);
                                    }
                                    errors++;
                                  }
                                }
                                if (data126.label !== void 0) {
                                  let data127 = data126.label;
                                  if (typeof data127 === "string") {
                                    if (func2(data127) > 300) {
                                      const err303 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7 + "/label", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/properties/label/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                      if (vErrors === null) {
                                        vErrors = [err303];
                                      } else {
                                        vErrors.push(err303);
                                      }
                                      errors++;
                                    }
                                  } else {
                                    const err304 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7 + "/label", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/properties/label/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err304];
                                    } else {
                                      vErrors.push(err304);
                                    }
                                    errors++;
                                  }
                                }
                                if (data126.href !== void 0) {
                                  let data128 = data126.href;
                                  if (typeof data128 === "string") {
                                    if (func2(data128) > 500) {
                                      const err305 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7 + "/href", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/properties/href/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                                      if (vErrors === null) {
                                        vErrors = [err305];
                                      } else {
                                        vErrors.push(err305);
                                      }
                                      errors++;
                                    }
                                    if (!pattern0.test(data128)) {
                                      const err306 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7 + "/href", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/properties/href/pattern", keyword: "pattern", params: { pattern: "^(#|/[^/]|https://|$)" }, message: 'must match pattern "^(#|/[^/]|https://|$)"' };
                                      if (vErrors === null) {
                                        vErrors = [err306];
                                      } else {
                                        vErrors.push(err306);
                                      }
                                      errors++;
                                    }
                                  } else {
                                    const err307 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7 + "/href", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/properties/href/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                    if (vErrors === null) {
                                      vErrors = [err307];
                                    } else {
                                      vErrors.push(err307);
                                    }
                                    errors++;
                                  }
                                }
                              } else {
                                const err308 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i7, schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                if (vErrors === null) {
                                  vErrors = [err308];
                                } else {
                                  vErrors.push(err308);
                                }
                                errors++;
                              }
                            }
                          } else {
                            const err309 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/items/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                            if (vErrors === null) {
                              vErrors = [err309];
                            } else {
                              vErrors.push(err309);
                            }
                            errors++;
                          }
                        }
                        if (data121.motto !== void 0) {
                          let data129 = data121.motto;
                          if (typeof data129 === "string") {
                            if (func2(data129) > 300) {
                              const err310 = { instancePath: instancePath + "/content/" + i0 + "/props/motto", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/motto/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err310];
                              } else {
                                vErrors.push(err310);
                              }
                              errors++;
                            }
                          } else {
                            const err311 = { instancePath: instancePath + "/content/" + i0 + "/props/motto", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/motto/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err311];
                            } else {
                              vErrors.push(err311);
                            }
                            errors++;
                          }
                        }
                        if (data121.title !== void 0) {
                          let data130 = data121.title;
                          if (typeof data130 === "string") {
                            if (func2(data130) > 12) {
                              const err312 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/title/maxLength", keyword: "maxLength", params: { limit: 12 }, message: "must NOT have more than 12 characters" };
                              if (vErrors === null) {
                                vErrors = [err312];
                              } else {
                                vErrors.push(err312);
                              }
                              errors++;
                            }
                          } else {
                            const err313 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err313];
                            } else {
                              vErrors.push(err313);
                            }
                            errors++;
                          }
                        }
                        if (data121.subtitle !== void 0) {
                          let data131 = data121.subtitle;
                          if (typeof data131 === "string") {
                            if (func2(data131) > 300) {
                              const err314 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/subtitle/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err314];
                              } else {
                                vErrors.push(err314);
                              }
                              errors++;
                            }
                          } else {
                            const err315 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/subtitle/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err315];
                            } else {
                              vErrors.push(err315);
                            }
                            errors++;
                          }
                        }
                        if (data121.wish !== void 0) {
                          let data132 = data121.wish;
                          if (typeof data132 === "string") {
                            if (func2(data132) > 300) {
                              const err316 = { instancePath: instancePath + "/content/" + i0 + "/props/wish", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/wish/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err316];
                              } else {
                                vErrors.push(err316);
                              }
                              errors++;
                            }
                          } else {
                            const err317 = { instancePath: instancePath + "/content/" + i0 + "/props/wish", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/wish/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err317];
                            } else {
                              vErrors.push(err317);
                            }
                            errors++;
                          }
                        }
                        if (data121.welcome !== void 0) {
                          let data133 = data121.welcome;
                          if (typeof data133 === "string") {
                            if (func2(data133) > 300) {
                              const err318 = { instancePath: instancePath + "/content/" + i0 + "/props/welcome", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/welcome/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err318];
                              } else {
                                vErrors.push(err318);
                              }
                              errors++;
                            }
                          } else {
                            const err319 = { instancePath: instancePath + "/content/" + i0 + "/props/welcome", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/welcome/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err319];
                            } else {
                              vErrors.push(err319);
                            }
                            errors++;
                          }
                        }
                        if (data121.learning !== void 0) {
                          let data134 = data121.learning;
                          if (typeof data134 === "string") {
                            if (func2(data134) > 300) {
                              const err320 = { instancePath: instancePath + "/content/" + i0 + "/props/learning", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/learning/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err320];
                              } else {
                                vErrors.push(err320);
                              }
                              errors++;
                            }
                          } else {
                            const err321 = { instancePath: instancePath + "/content/" + i0 + "/props/learning", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/learning/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err321];
                            } else {
                              vErrors.push(err321);
                            }
                            errors++;
                          }
                        }
                        if (data121.years !== void 0) {
                          let data135 = data121.years;
                          if (typeof data135 === "string") {
                            if (func2(data135) > 300) {
                              const err322 = { instancePath: instancePath + "/content/" + i0 + "/props/years", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/years/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err322];
                              } else {
                                vErrors.push(err322);
                              }
                              errors++;
                            }
                          } else {
                            const err323 = { instancePath: instancePath + "/content/" + i0 + "/props/years", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/years/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err323];
                            } else {
                              vErrors.push(err323);
                            }
                            errors++;
                          }
                        }
                        if (data121.category !== void 0) {
                          let data136 = data121.category;
                          if (typeof data136 === "string") {
                            if (func2(data136) > 300) {
                              const err324 = { instancePath: instancePath + "/content/" + i0 + "/props/category", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/category/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                              if (vErrors === null) {
                                vErrors = [err324];
                              } else {
                                vErrors.push(err324);
                              }
                              errors++;
                            }
                          } else {
                            const err325 = { instancePath: instancePath + "/content/" + i0 + "/props/category", schemaPath: "#/properties/content/items/oneOf/5/properties/props/properties/category/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err325];
                            } else {
                              vErrors.push(err325);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err326 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/5/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                        if (vErrors === null) {
                          vErrors = [err326];
                        } else {
                          vErrors.push(err326);
                        }
                        errors++;
                      }
                    }
                    if (data6.readOnly !== void 0) {
                      let data137 = data6.readOnly;
                      if (data137 && typeof data137 == "object" && !Array.isArray(data137)) {
                        for (const key28 in data137) {
                          if (!func8.call(schema11.properties.content.items.oneOf[5].properties.readOnly.properties, key28)) {
                            const err327 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key28 }, message: "must NOT have additional properties" };
                            if (vErrors === null) {
                              vErrors = [err327];
                            } else {
                              vErrors.push(err327);
                            }
                            errors++;
                          }
                        }
                        if (data137.id !== void 0) {
                          if (typeof data137.id !== "boolean") {
                            const err328 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err328];
                            } else {
                              vErrors.push(err328);
                            }
                            errors++;
                          }
                        }
                        if (data137.version !== void 0) {
                          if (typeof data137.version !== "boolean") {
                            const err329 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err329];
                            } else {
                              vErrors.push(err329);
                            }
                            errors++;
                          }
                        }
                        if (data137.brand !== void 0) {
                          if (typeof data137.brand !== "boolean") {
                            const err330 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/brand", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/brand/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err330];
                            } else {
                              vErrors.push(err330);
                            }
                            errors++;
                          }
                        }
                        if (data137.items !== void 0) {
                          if (typeof data137.items !== "boolean") {
                            const err331 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/items", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/items/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err331];
                            } else {
                              vErrors.push(err331);
                            }
                            errors++;
                          }
                        }
                        if (data137.motto !== void 0) {
                          if (typeof data137.motto !== "boolean") {
                            const err332 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/motto", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/motto/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err332];
                            } else {
                              vErrors.push(err332);
                            }
                            errors++;
                          }
                        }
                        if (data137.title !== void 0) {
                          if (typeof data137.title !== "boolean") {
                            const err333 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/title", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/title/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err333];
                            } else {
                              vErrors.push(err333);
                            }
                            errors++;
                          }
                        }
                        if (data137.subtitle !== void 0) {
                          if (typeof data137.subtitle !== "boolean") {
                            const err334 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/subtitle", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/subtitle/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err334];
                            } else {
                              vErrors.push(err334);
                            }
                            errors++;
                          }
                        }
                        if (data137.wish !== void 0) {
                          if (typeof data137.wish !== "boolean") {
                            const err335 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/wish", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/wish/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err335];
                            } else {
                              vErrors.push(err335);
                            }
                            errors++;
                          }
                        }
                        if (data137.welcome !== void 0) {
                          if (typeof data137.welcome !== "boolean") {
                            const err336 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/welcome", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/welcome/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err336];
                            } else {
                              vErrors.push(err336);
                            }
                            errors++;
                          }
                        }
                        if (data137.learning !== void 0) {
                          if (typeof data137.learning !== "boolean") {
                            const err337 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/learning", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/learning/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err337];
                            } else {
                              vErrors.push(err337);
                            }
                            errors++;
                          }
                        }
                        if (data137.years !== void 0) {
                          if (typeof data137.years !== "boolean") {
                            const err338 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/years", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/years/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err338];
                            } else {
                              vErrors.push(err338);
                            }
                            errors++;
                          }
                        }
                        if (data137.category !== void 0) {
                          if (typeof data137.category !== "boolean") {
                            const err339 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/category", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/properties/category/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                            if (vErrors === null) {
                              vErrors = [err339];
                            } else {
                              vErrors.push(err339);
                            }
                            errors++;
                          }
                        }
                      } else {
                        const err340 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/5/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                        if (vErrors === null) {
                          vErrors = [err340];
                        } else {
                          vErrors.push(err340);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err341 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/5/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                    if (vErrors === null) {
                      vErrors = [err341];
                    } else {
                      vErrors.push(err341);
                    }
                    errors++;
                  }
                  var _valid0 = _errs265 === errors;
                  if (_valid0 && valid6) {
                    valid6 = false;
                    passing0 = [passing0, 5];
                  } else {
                    if (_valid0) {
                      valid6 = true;
                      passing0 = 5;
                    }
                    const _errs329 = errors;
                    if (data6 && typeof data6 == "object" && !Array.isArray(data6)) {
                      if (data6.type === void 0) {
                        const err342 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/6/required", keyword: "required", params: { missingProperty: "type" }, message: "must have required property 'type'" };
                        if (vErrors === null) {
                          vErrors = [err342];
                        } else {
                          vErrors.push(err342);
                        }
                        errors++;
                      }
                      if (data6.props === void 0) {
                        const err343 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/6/required", keyword: "required", params: { missingProperty: "props" }, message: "must have required property 'props'" };
                        if (vErrors === null) {
                          vErrors = [err343];
                        } else {
                          vErrors.push(err343);
                        }
                        errors++;
                      }
                      for (const key29 in data6) {
                        if (!(key29 === "type" || key29 === "props" || key29 === "readOnly")) {
                          const err344 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/6/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key29 }, message: "must NOT have additional properties" };
                          if (vErrors === null) {
                            vErrors = [err344];
                          } else {
                            vErrors.push(err344);
                          }
                          errors++;
                        }
                      }
                      if (data6.type !== void 0) {
                        if ("OverlayGallery" !== data6.type) {
                          const err345 = { instancePath: instancePath + "/content/" + i0 + "/type", schemaPath: "#/properties/content/items/oneOf/6/properties/type/const", keyword: "const", params: { allowedValue: "OverlayGallery" }, message: "must be equal to constant" };
                          if (vErrors === null) {
                            vErrors = [err345];
                          } else {
                            vErrors.push(err345);
                          }
                          errors++;
                        }
                      }
                      if (data6.props !== void 0) {
                        let data151 = data6.props;
                        if (data151 && typeof data151 == "object" && !Array.isArray(data151)) {
                          if (data151.id === void 0) {
                            const err346 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/required", keyword: "required", params: { missingProperty: "id" }, message: "must have required property 'id'" };
                            if (vErrors === null) {
                              vErrors = [err346];
                            } else {
                              vErrors.push(err346);
                            }
                            errors++;
                          }
                          if (data151.version === void 0) {
                            const err347 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/required", keyword: "required", params: { missingProperty: "version" }, message: "must have required property 'version'" };
                            if (vErrors === null) {
                              vErrors = [err347];
                            } else {
                              vErrors.push(err347);
                            }
                            errors++;
                          }
                          if (data151.title === void 0) {
                            const err348 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/required", keyword: "required", params: { missingProperty: "title" }, message: "must have required property 'title'" };
                            if (vErrors === null) {
                              vErrors = [err348];
                            } else {
                              vErrors.push(err348);
                            }
                            errors++;
                          }
                          if (data151.subtitle === void 0) {
                            const err349 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/required", keyword: "required", params: { missingProperty: "subtitle" }, message: "must have required property 'subtitle'" };
                            if (vErrors === null) {
                              vErrors = [err349];
                            } else {
                              vErrors.push(err349);
                            }
                            errors++;
                          }
                          if (data151.category === void 0) {
                            const err350 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/required", keyword: "required", params: { missingProperty: "category" }, message: "must have required property 'category'" };
                            if (vErrors === null) {
                              vErrors = [err350];
                            } else {
                              vErrors.push(err350);
                            }
                            errors++;
                          }
                          if (data151.items === void 0) {
                            const err351 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/required", keyword: "required", params: { missingProperty: "items" }, message: "must have required property 'items'" };
                            if (vErrors === null) {
                              vErrors = [err351];
                            } else {
                              vErrors.push(err351);
                            }
                            errors++;
                          }
                          for (const key30 in data151) {
                            if (!(key30 === "id" || key30 === "version" || key30 === "title" || key30 === "subtitle" || key30 === "category" || key30 === "items" || key30 === "layout")) {
                              const err352 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key30 }, message: "must NOT have additional properties" };
                              if (vErrors === null) {
                                vErrors = [err352];
                              } else {
                                vErrors.push(err352);
                              }
                              errors++;
                            }
                          }
                          if (data151.id !== void 0) {
                            let data152 = data151.id;
                            if (typeof data152 === "string") {
                              if (func2(data152) > 100) {
                                const err353 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/id/maxLength", keyword: "maxLength", params: { limit: 100 }, message: "must NOT have more than 100 characters" };
                                if (vErrors === null) {
                                  vErrors = [err353];
                                } else {
                                  vErrors.push(err353);
                                }
                                errors++;
                              }
                              if (func2(data152) < 1) {
                                const err354 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/id/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" };
                                if (vErrors === null) {
                                  vErrors = [err354];
                                } else {
                                  vErrors.push(err354);
                                }
                                errors++;
                              }
                            } else {
                              const err355 = { instancePath: instancePath + "/content/" + i0 + "/props/id", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/id/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err355];
                              } else {
                                vErrors.push(err355);
                              }
                              errors++;
                            }
                          }
                          if (data151.version !== void 0) {
                            if (1 !== data151.version) {
                              const err356 = { instancePath: instancePath + "/content/" + i0 + "/props/version", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/version/const", keyword: "const", params: { allowedValue: 1 }, message: "must be equal to constant" };
                              if (vErrors === null) {
                                vErrors = [err356];
                              } else {
                                vErrors.push(err356);
                              }
                              errors++;
                            }
                          }
                          if (data151.title !== void 0) {
                            let data154 = data151.title;
                            if (typeof data154 === "string") {
                              if (func2(data154) > 300) {
                                const err357 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/title/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                if (vErrors === null) {
                                  vErrors = [err357];
                                } else {
                                  vErrors.push(err357);
                                }
                                errors++;
                              }
                            } else {
                              const err358 = { instancePath: instancePath + "/content/" + i0 + "/props/title", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/title/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err358];
                              } else {
                                vErrors.push(err358);
                              }
                              errors++;
                            }
                          }
                          if (data151.subtitle !== void 0) {
                            let data155 = data151.subtitle;
                            if (typeof data155 === "string") {
                              if (func2(data155) > 300) {
                                const err359 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/subtitle/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                if (vErrors === null) {
                                  vErrors = [err359];
                                } else {
                                  vErrors.push(err359);
                                }
                                errors++;
                              }
                            } else {
                              const err360 = { instancePath: instancePath + "/content/" + i0 + "/props/subtitle", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/subtitle/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err360];
                              } else {
                                vErrors.push(err360);
                              }
                              errors++;
                            }
                          }
                          if (data151.category !== void 0) {
                            let data156 = data151.category;
                            if (typeof data156 === "string") {
                              if (func2(data156) > 300) {
                                const err361 = { instancePath: instancePath + "/content/" + i0 + "/props/category", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/category/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                if (vErrors === null) {
                                  vErrors = [err361];
                                } else {
                                  vErrors.push(err361);
                                }
                                errors++;
                              }
                            } else {
                              const err362 = { instancePath: instancePath + "/content/" + i0 + "/props/category", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/category/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                              if (vErrors === null) {
                                vErrors = [err362];
                              } else {
                                vErrors.push(err362);
                              }
                              errors++;
                            }
                          }
                          if (data151.items !== void 0) {
                            let data157 = data151.items;
                            if (Array.isArray(data157)) {
                              if (data157.length > 12) {
                                const err363 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/maxItems", keyword: "maxItems", params: { limit: 12 }, message: "must NOT have more than 12 items" };
                                if (vErrors === null) {
                                  vErrors = [err363];
                                } else {
                                  vErrors.push(err363);
                                }
                                errors++;
                              }
                              const len8 = data157.length;
                              for (let i8 = 0; i8 < len8; i8++) {
                                let data158 = data157[i8];
                                const _errs350 = errors;
                                let valid51 = true;
                                const _errs351 = errors;
                                if (data158 && typeof data158 == "object" && !Array.isArray(data158)) {
                                  let missing0;
                                  if (data158.dynamic === void 0 && (missing0 = "dynamic")) {
                                    const err364 = {};
                                    if (vErrors === null) {
                                      vErrors = [err364];
                                    } else {
                                      vErrors.push(err364);
                                    }
                                    errors++;
                                  } else {
                                    if (data158.dynamic !== void 0) {
                                      if (true !== data158.dynamic) {
                                        const err365 = {};
                                        if (vErrors === null) {
                                          vErrors = [err365];
                                        } else {
                                          vErrors.push(err365);
                                        }
                                        errors++;
                                      }
                                    }
                                  }
                                }
                                var _valid1 = _errs351 === errors;
                                errors = _errs350;
                                if (vErrors !== null) {
                                  if (_errs350) {
                                    vErrors.length = _errs350;
                                  } else {
                                    vErrors = null;
                                  }
                                }
                                if (_valid1) {
                                  const _errs353 = errors;
                                  if (data158 && typeof data158 == "object" && !Array.isArray(data158)) {
                                    if (data158.src !== void 0) {
                                      let data160 = data158.src;
                                      if (!(data160 === "/images/works/260117_\u8D34\u7247_\u5BA0\u7269\u751F\u6D3B_\u6BDB\u5B69\u5B50/\u8D34\u7247\u9884\u89C8.jpg" || data160 === "/images/overlay/pet-life.jpg" || data160 === "/images/works/pet-life/cover.jpg" || data160 === "/images/works/260109_\u8D34\u7247_\u94F2\u5C4E\u5B98\u732B\u7802\u7AD9_\u732B\u738B\u732B\u7802/\u8D34\u7247\u9884\u89C8.jpg" || data160 === "/images/overlay/cat-litter.jpg" || data160 === "/images/works/cat-litter/cover.jpg" || data160 === "/images/works/250806_\u8D34\u7247_\u5BA0\u7269\u751F\u6D3B_\u62A2\u8DD1\u4E9A\u5BA0\u5C55/\u8D34\u7247\u9884\u89C8.jpg" || data160 === "/images/overlay/pet-expo.jpg" || data160 === "/images/works/pet-expo/cover.jpg" || data160 === "/images/works/251121_\u8D34\u7247_\u5BA0\u7269\u751F\u6D3B_\u963F\u98DE\u548C\u5DF4\u5F1F/\u8D34\u7247\u9884\u89C8.jpg" || data160 === "/images/overlay/alfie-buddy.jpg" || data160 === "/images/works/alfie-buddy/cover.jpg")) {
                                        const err366 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/src", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/allOf/0/then/properties/src/enum", keyword: "enum", params: { allowedValues: schema11.properties.content.items.oneOf[6].properties.props.properties.items.items.allOf[0].then.properties.src.enum }, message: "must be equal to one of the allowed values" };
                                        if (vErrors === null) {
                                          vErrors = [err366];
                                        } else {
                                          vErrors.push(err366);
                                        }
                                        errors++;
                                      }
                                    }
                                  }
                                  var _valid1 = _errs353 === errors;
                                  valid51 = _valid1;
                                }
                                if (!valid51) {
                                  const err367 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8, schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/allOf/0/if", keyword: "if", params: { failingKeyword: "then" }, message: 'must match "then" schema' };
                                  if (vErrors === null) {
                                    vErrors = [err367];
                                  } else {
                                    vErrors.push(err367);
                                  }
                                  errors++;
                                }
                                if (data158 && typeof data158 == "object" && !Array.isArray(data158)) {
                                  if (data158.src === void 0) {
                                    const err368 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8, schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "src" }, message: "must have required property 'src'" };
                                    if (vErrors === null) {
                                      vErrors = [err368];
                                    } else {
                                      vErrors.push(err368);
                                    }
                                    errors++;
                                  }
                                  if (data158.alt === void 0) {
                                    const err369 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8, schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/required", keyword: "required", params: { missingProperty: "alt" }, message: "must have required property 'alt'" };
                                    if (vErrors === null) {
                                      vErrors = [err369];
                                    } else {
                                      vErrors.push(err369);
                                    }
                                    errors++;
                                  }
                                  for (const key31 in data158) {
                                    if (!(key31 === "src" || key31 === "alt" || key31 === "workId" || key31 === "dynamic")) {
                                      const err370 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8, schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key31 }, message: "must NOT have additional properties" };
                                      if (vErrors === null) {
                                        vErrors = [err370];
                                      } else {
                                        vErrors.push(err370);
                                      }
                                      errors++;
                                    }
                                  }
                                  if (data158.src !== void 0) {
                                    let data161 = data158.src;
                                    if (typeof data161 === "string") {
                                      if (func2(data161) > 500) {
                                        const err371 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/src", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/src/maxLength", keyword: "maxLength", params: { limit: 500 }, message: "must NOT have more than 500 characters" };
                                        if (vErrors === null) {
                                          vErrors = [err371];
                                        } else {
                                          vErrors.push(err371);
                                        }
                                        errors++;
                                      }
                                      if (!pattern2.test(data161)) {
                                        const err372 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/src", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/src/pattern", keyword: "pattern", params: { pattern: "^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$" }, message: 'must match pattern "^/images/(?!\\.{1,2}(?:/|$))(?!.*\\/\\.{1,2}(?:/|$))[^\\u0000-\\u001f%?#\\\\]+$"' };
                                        if (vErrors === null) {
                                          vErrors = [err372];
                                        } else {
                                          vErrors.push(err372);
                                        }
                                        errors++;
                                      }
                                    } else {
                                      const err373 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/src", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/src/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err373];
                                      } else {
                                        vErrors.push(err373);
                                      }
                                      errors++;
                                    }
                                  }
                                  if (data158.alt !== void 0) {
                                    let data162 = data158.alt;
                                    if (typeof data162 === "string") {
                                      if (func2(data162) > 300) {
                                        const err374 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/alt", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/alt/maxLength", keyword: "maxLength", params: { limit: 300 }, message: "must NOT have more than 300 characters" };
                                        if (vErrors === null) {
                                          vErrors = [err374];
                                        } else {
                                          vErrors.push(err374);
                                        }
                                        errors++;
                                      }
                                    } else {
                                      const err375 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/alt", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/alt/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                                      if (vErrors === null) {
                                        vErrors = [err375];
                                      } else {
                                        vErrors.push(err375);
                                      }
                                      errors++;
                                    }
                                  }
                                  if (data158.workId !== void 0) {
                                    let data163 = data158.workId;
                                    if (!(data163 === "" || data163 === "ice-cream" || data163 === "crocs" || data163 === "junlebao" || data163 === "auldey" || data163 === "pet-life" || data163 === "cat-litter" || data163 === "pet-expo" || data163 === "alfie-buddy")) {
                                      const err376 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/workId", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/workId/enum", keyword: "enum", params: { allowedValues: schema11.properties.content.items.oneOf[6].properties.props.properties.items.items.properties.workId.enum }, message: "must be equal to one of the allowed values" };
                                      if (vErrors === null) {
                                        vErrors = [err376];
                                      } else {
                                        vErrors.push(err376);
                                      }
                                      errors++;
                                    }
                                  }
                                  if (data158.dynamic !== void 0) {
                                    if (typeof data158.dynamic !== "boolean") {
                                      const err377 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8 + "/dynamic", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/properties/dynamic/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                                      if (vErrors === null) {
                                        vErrors = [err377];
                                      } else {
                                        vErrors.push(err377);
                                      }
                                      errors++;
                                    }
                                  }
                                } else {
                                  const err378 = { instancePath: instancePath + "/content/" + i0 + "/props/items/" + i8, schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/items/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                                  if (vErrors === null) {
                                    vErrors = [err378];
                                  } else {
                                    vErrors.push(err378);
                                  }
                                  errors++;
                                }
                              }
                            } else {
                              const err379 = { instancePath: instancePath + "/content/" + i0 + "/props/items", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/items/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                              if (vErrors === null) {
                                vErrors = [err379];
                              } else {
                                vErrors.push(err379);
                              }
                              errors++;
                            }
                          }
                          if (data151.layout !== void 0) {
                            let data165 = data151.layout;
                            if (data165 && typeof data165 == "object" && !Array.isArray(data165)) {
                              if (data165.safeWidth === void 0) {
                                const err380 = { instancePath: instancePath + "/content/" + i0 + "/props/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/required", keyword: "required", params: { missingProperty: "safeWidth" }, message: "must have required property 'safeWidth'" };
                                if (vErrors === null) {
                                  vErrors = [err380];
                                } else {
                                  vErrors.push(err380);
                                }
                                errors++;
                              }
                              if (data165.imageWidth === void 0) {
                                const err381 = { instancePath: instancePath + "/content/" + i0 + "/props/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/required", keyword: "required", params: { missingProperty: "imageWidth" }, message: "must have required property 'imageWidth'" };
                                if (vErrors === null) {
                                  vErrors = [err381];
                                } else {
                                  vErrors.push(err381);
                                }
                                errors++;
                              }
                              if (data165.imageHeight === void 0) {
                                const err382 = { instancePath: instancePath + "/content/" + i0 + "/props/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/required", keyword: "required", params: { missingProperty: "imageHeight" }, message: "must have required property 'imageHeight'" };
                                if (vErrors === null) {
                                  vErrors = [err382];
                                } else {
                                  vErrors.push(err382);
                                }
                                errors++;
                              }
                              if (data165.gap === void 0) {
                                const err383 = { instancePath: instancePath + "/content/" + i0 + "/props/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/required", keyword: "required", params: { missingProperty: "gap" }, message: "must have required property 'gap'" };
                                if (vErrors === null) {
                                  vErrors = [err383];
                                } else {
                                  vErrors.push(err383);
                                }
                                errors++;
                              }
                              for (const key32 in data165) {
                                if (!(key32 === "safeWidth" || key32 === "imageWidth" || key32 === "imageHeight" || key32 === "gap")) {
                                  const err384 = { instancePath: instancePath + "/content/" + i0 + "/props/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key32 }, message: "must NOT have additional properties" };
                                  if (vErrors === null) {
                                    vErrors = [err384];
                                  } else {
                                    vErrors.push(err384);
                                  }
                                  errors++;
                                }
                              }
                              if (data165.safeWidth !== void 0) {
                                let data166 = data165.safeWidth;
                                if (typeof data166 == "number" && isFinite(data166)) {
                                  if (data166 > 1e4 || isNaN(data166)) {
                                    const err385 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/safeWidth", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/safeWidth/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                                    if (vErrors === null) {
                                      vErrors = [err385];
                                    } else {
                                      vErrors.push(err385);
                                    }
                                    errors++;
                                  }
                                  if (data166 < 0.01 || isNaN(data166)) {
                                    const err386 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/safeWidth", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/safeWidth/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0.01 }, message: "must be >= 0.01" };
                                    if (vErrors === null) {
                                      vErrors = [err386];
                                    } else {
                                      vErrors.push(err386);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err387 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/safeWidth", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/safeWidth/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                  if (vErrors === null) {
                                    vErrors = [err387];
                                  } else {
                                    vErrors.push(err387);
                                  }
                                  errors++;
                                }
                              }
                              if (data165.imageWidth !== void 0) {
                                let data167 = data165.imageWidth;
                                if (typeof data167 == "number" && isFinite(data167)) {
                                  if (data167 > 1e4 || isNaN(data167)) {
                                    const err388 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/imageWidth", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/imageWidth/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                                    if (vErrors === null) {
                                      vErrors = [err388];
                                    } else {
                                      vErrors.push(err388);
                                    }
                                    errors++;
                                  }
                                  if (data167 < 0.01 || isNaN(data167)) {
                                    const err389 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/imageWidth", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/imageWidth/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0.01 }, message: "must be >= 0.01" };
                                    if (vErrors === null) {
                                      vErrors = [err389];
                                    } else {
                                      vErrors.push(err389);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err390 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/imageWidth", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/imageWidth/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                  if (vErrors === null) {
                                    vErrors = [err390];
                                  } else {
                                    vErrors.push(err390);
                                  }
                                  errors++;
                                }
                              }
                              if (data165.imageHeight !== void 0) {
                                let data168 = data165.imageHeight;
                                if (typeof data168 == "number" && isFinite(data168)) {
                                  if (data168 > 1e4 || isNaN(data168)) {
                                    const err391 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/imageHeight", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/imageHeight/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                                    if (vErrors === null) {
                                      vErrors = [err391];
                                    } else {
                                      vErrors.push(err391);
                                    }
                                    errors++;
                                  }
                                  if (data168 < 0.01 || isNaN(data168)) {
                                    const err392 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/imageHeight", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/imageHeight/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0.01 }, message: "must be >= 0.01" };
                                    if (vErrors === null) {
                                      vErrors = [err392];
                                    } else {
                                      vErrors.push(err392);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err393 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/imageHeight", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/imageHeight/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                  if (vErrors === null) {
                                    vErrors = [err393];
                                  } else {
                                    vErrors.push(err393);
                                  }
                                  errors++;
                                }
                              }
                              if (data165.gap !== void 0) {
                                let data169 = data165.gap;
                                if (typeof data169 == "number" && isFinite(data169)) {
                                  if (data169 > 1e4 || isNaN(data169)) {
                                    const err394 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/gap", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/gap/maximum", keyword: "maximum", params: { comparison: "<=", limit: 1e4 }, message: "must be <= 10000" };
                                    if (vErrors === null) {
                                      vErrors = [err394];
                                    } else {
                                      vErrors.push(err394);
                                    }
                                    errors++;
                                  }
                                  if (data169 < 0 || isNaN(data169)) {
                                    const err395 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/gap", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/gap/minimum", keyword: "minimum", params: { comparison: ">=", limit: 0 }, message: "must be >= 0" };
                                    if (vErrors === null) {
                                      vErrors = [err395];
                                    } else {
                                      vErrors.push(err395);
                                    }
                                    errors++;
                                  }
                                } else {
                                  const err396 = { instancePath: instancePath + "/content/" + i0 + "/props/layout/gap", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/properties/gap/type", keyword: "type", params: { type: "number" }, message: "must be number" };
                                  if (vErrors === null) {
                                    vErrors = [err396];
                                  } else {
                                    vErrors.push(err396);
                                  }
                                  errors++;
                                }
                              }
                            } else {
                              const err397 = { instancePath: instancePath + "/content/" + i0 + "/props/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/props/properties/layout/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                              if (vErrors === null) {
                                vErrors = [err397];
                              } else {
                                vErrors.push(err397);
                              }
                              errors++;
                            }
                          }
                        } else {
                          const err398 = { instancePath: instancePath + "/content/" + i0 + "/props", schemaPath: "#/properties/content/items/oneOf/6/properties/props/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                          if (vErrors === null) {
                            vErrors = [err398];
                          } else {
                            vErrors.push(err398);
                          }
                          errors++;
                        }
                      }
                      if (data6.readOnly !== void 0) {
                        let data170 = data6.readOnly;
                        if (data170 && typeof data170 == "object" && !Array.isArray(data170)) {
                          for (const key33 in data170) {
                            if (!(key33 === "id" || key33 === "version" || key33 === "title" || key33 === "subtitle" || key33 === "category" || key33 === "items" || key33 === "layout")) {
                              const err399 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key33 }, message: "must NOT have additional properties" };
                              if (vErrors === null) {
                                vErrors = [err399];
                              } else {
                                vErrors.push(err399);
                              }
                              errors++;
                            }
                          }
                          if (data170.id !== void 0) {
                            if (typeof data170.id !== "boolean") {
                              const err400 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/id", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/id/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err400];
                              } else {
                                vErrors.push(err400);
                              }
                              errors++;
                            }
                          }
                          if (data170.version !== void 0) {
                            if (typeof data170.version !== "boolean") {
                              const err401 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/version", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/version/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err401];
                              } else {
                                vErrors.push(err401);
                              }
                              errors++;
                            }
                          }
                          if (data170.title !== void 0) {
                            if (typeof data170.title !== "boolean") {
                              const err402 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/title", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/title/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err402];
                              } else {
                                vErrors.push(err402);
                              }
                              errors++;
                            }
                          }
                          if (data170.subtitle !== void 0) {
                            if (typeof data170.subtitle !== "boolean") {
                              const err403 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/subtitle", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/subtitle/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err403];
                              } else {
                                vErrors.push(err403);
                              }
                              errors++;
                            }
                          }
                          if (data170.category !== void 0) {
                            if (typeof data170.category !== "boolean") {
                              const err404 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/category", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/category/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err404];
                              } else {
                                vErrors.push(err404);
                              }
                              errors++;
                            }
                          }
                          if (data170.items !== void 0) {
                            if (typeof data170.items !== "boolean") {
                              const err405 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/items", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/items/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err405];
                              } else {
                                vErrors.push(err405);
                              }
                              errors++;
                            }
                          }
                          if (data170.layout !== void 0) {
                            if (typeof data170.layout !== "boolean") {
                              const err406 = { instancePath: instancePath + "/content/" + i0 + "/readOnly/layout", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/properties/layout/type", keyword: "type", params: { type: "boolean" }, message: "must be boolean" };
                              if (vErrors === null) {
                                vErrors = [err406];
                              } else {
                                vErrors.push(err406);
                              }
                              errors++;
                            }
                          }
                        } else {
                          const err407 = { instancePath: instancePath + "/content/" + i0 + "/readOnly", schemaPath: "#/properties/content/items/oneOf/6/properties/readOnly/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                          if (vErrors === null) {
                            vErrors = [err407];
                          } else {
                            vErrors.push(err407);
                          }
                          errors++;
                        }
                      }
                    } else {
                      const err408 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf/6/type", keyword: "type", params: { type: "object" }, message: "must be object" };
                      if (vErrors === null) {
                        vErrors = [err408];
                      } else {
                        vErrors.push(err408);
                      }
                      errors++;
                    }
                    var _valid0 = _errs329 === errors;
                    if (_valid0 && valid6) {
                      valid6 = false;
                      passing0 = [passing0, 6];
                    } else {
                      if (_valid0) {
                        valid6 = true;
                        passing0 = 6;
                      }
                    }
                  }
                }
              }
            }
          }
          if (!valid6) {
            const err409 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
            if (vErrors === null) {
              vErrors = [err409];
            } else {
              vErrors.push(err409);
            }
            errors++;
          } else {
            errors = _errs18;
            if (vErrors !== null) {
              if (_errs18) {
                vErrors.length = _errs18;
              } else {
                vErrors = null;
              }
            }
          }
        }
      } else {
        const err410 = { instancePath: instancePath + "/content", schemaPath: "#/properties/content/type", keyword: "type", params: { type: "array" }, message: "must be array" };
        if (vErrors === null) {
          vErrors = [err410];
        } else {
          vErrors.push(err410);
        }
        errors++;
      }
    }
    if (data.zones !== void 0) {
      let data178 = data.zones;
      if (data178 && typeof data178 == "object" && !Array.isArray(data178)) {
        if (Object.keys(data178).length > 0) {
          const err411 = { instancePath: instancePath + "/zones", schemaPath: "#/properties/zones/maxProperties", keyword: "maxProperties", params: { limit: 0 }, message: "must NOT have more than 0 properties" };
          if (vErrors === null) {
            vErrors = [err411];
          } else {
            vErrors.push(err411);
          }
          errors++;
        }
        for (const key34 in data178) {
          const err412 = { instancePath: instancePath + "/zones", schemaPath: "#/properties/zones/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key34 }, message: "must NOT have additional properties" };
          if (vErrors === null) {
            vErrors = [err412];
          } else {
            vErrors.push(err412);
          }
          errors++;
        }
      } else {
        const err413 = { instancePath: instancePath + "/zones", schemaPath: "#/properties/zones/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
          vErrors = [err413];
        } else {
          vErrors.push(err413);
        }
        errors++;
      }
    }
  } else {
    const err414 = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
    if (vErrors === null) {
      vErrors = [err414];
    } else {
      vErrors.push(err414);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
export {
  stdin_default as default,
  validate
};
