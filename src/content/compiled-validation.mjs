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
var schema11 = { "type": "object", "additionalProperties": false, "properties": { "root": { "type": "object", "additionalProperties": false, "properties": { "props": { "type": "object", "additionalProperties": false, "properties": { "chrome": { "type": "boolean" } }, "required": ["chrome"] }, "readOnly": { "type": "object", "properties": { "chrome": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["props"] }, "content": { "type": "array", "minItems": 1, "maxItems": 30, "items": { "oneOf": [{ "type": "object", "additionalProperties": false, "properties": { "type": { "const": "Navigation" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "brand": { "type": "string", "maxLength": 300 }, "items": { "type": "array", "maxItems": 8, "items": { "type": "object", "additionalProperties": false, "properties": { "label": { "type": "string", "maxLength": 300 }, "href": { "type": "string", "maxLength": 500, "pattern": "^(#|/[^/]|https://|$)" } }, "required": ["label", "href"] } }, "motto": { "type": "string", "maxLength": 300 } }, "required": ["id", "version", "brand", "items", "motto"] }, "readOnly": { "type": "object", "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "brand": { "type": "boolean" }, "items": { "type": "boolean" }, "motto": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "PortfolioHero" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "title": { "type": "string", "minLength": 1, "maxLength": 12 }, "subtitle": { "type": "string", "maxLength": 300 }, "welcome": { "type": "string", "maxLength": 300 }, "motto": { "type": "string", "maxLength": 300 }, "font": { "enum": ["display", "body"] }, "ink": { "type": "string", "pattern": "^(inherit|#[0-9a-fA-F]{6})$" }, "spacing": { "type": "number", "minimum": 4, "maximum": 30 } }, "required": ["id", "version", "title", "subtitle", "welcome", "motto", "font", "ink", "spacing"] }, "readOnly": { "type": "object", "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "title": { "type": "boolean" }, "subtitle": { "type": "boolean" }, "welcome": { "type": "boolean" }, "motto": { "type": "boolean" }, "font": { "type": "boolean" }, "ink": { "type": "boolean" }, "spacing": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["type", "props"] }, { "type": "object", "additionalProperties": false, "properties": { "type": { "const": "Footer" }, "props": { "type": "object", "additionalProperties": false, "properties": { "id": { "type": "string", "minLength": 1, "maxLength": 100 }, "version": { "const": 1 }, "years": { "type": "string", "maxLength": 300 }, "category": { "type": "string", "maxLength": 300 } }, "required": ["id", "version", "years", "category"] }, "readOnly": { "type": "object", "properties": { "id": { "type": "boolean" }, "version": { "type": "boolean" }, "years": { "type": "boolean" }, "category": { "type": "boolean" } }, "additionalProperties": false } }, "required": ["type", "props"] }] } }, "zones": { "type": "object", "maxProperties": 0, "additionalProperties": false } }, "required": ["root", "content"] };
var func2 = require_ucs2length().default;
var func8 = Object.prototype.hasOwnProperty;
var pattern0 = new RegExp("^(#|/[^/]|https://|$)", "u");
var pattern1 = new RegExp("^(inherit|#[0-9a-fA-F]{6})$", "u");
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
            }
          }
          if (!valid6) {
            const err124 = { instancePath: instancePath + "/content/" + i0, schemaPath: "#/properties/content/items/oneOf", keyword: "oneOf", params: { passingSchemas: passing0 }, message: "must match exactly one schema in oneOf" };
            if (vErrors === null) {
              vErrors = [err124];
            } else {
              vErrors.push(err124);
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
        const err125 = { instancePath: instancePath + "/content", schemaPath: "#/properties/content/type", keyword: "type", params: { type: "array" }, message: "must be array" };
        if (vErrors === null) {
          vErrors = [err125];
        } else {
          vErrors.push(err125);
        }
        errors++;
      }
    }
    if (data.zones !== void 0) {
      let data55 = data.zones;
      if (data55 && typeof data55 == "object" && !Array.isArray(data55)) {
        if (Object.keys(data55).length > 0) {
          const err126 = { instancePath: instancePath + "/zones", schemaPath: "#/properties/zones/maxProperties", keyword: "maxProperties", params: { limit: 0 }, message: "must NOT have more than 0 properties" };
          if (vErrors === null) {
            vErrors = [err126];
          } else {
            vErrors.push(err126);
          }
          errors++;
        }
        for (const key14 in data55) {
          const err127 = { instancePath: instancePath + "/zones", schemaPath: "#/properties/zones/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key14 }, message: "must NOT have additional properties" };
          if (vErrors === null) {
            vErrors = [err127];
          } else {
            vErrors.push(err127);
          }
          errors++;
        }
      } else {
        const err128 = { instancePath: instancePath + "/zones", schemaPath: "#/properties/zones/type", keyword: "type", params: { type: "object" }, message: "must be object" };
        if (vErrors === null) {
          vErrors = [err128];
        } else {
          vErrors.push(err128);
        }
        errors++;
      }
    }
  } else {
    const err129 = { instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" };
    if (vErrors === null) {
      vErrors = [err129];
    } else {
      vErrors.push(err129);
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
