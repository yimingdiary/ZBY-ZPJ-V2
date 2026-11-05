import { createContext, useContext } from "react";
/** 页面级装饰开关。模块通过公共上下文读取，不依赖彼此内部实现。 */
export const DecorationVisibility = createContext(true);
export const useDecorationVisibility = () => useContext(DecorationVisibility);
