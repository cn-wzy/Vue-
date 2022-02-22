// 模板编译的目的：把用户所写的模板转化成提供给Vue实例在挂载时可调用的render函数。

import { optimize } from "./15优化解析器";
import { generate } from "./16代码生成render";

//整体流程
//$mount方法
Vue.prototype.$mount = function (el) {
  const options = this.$options;
  // 如果用户没有手写render函数
  if (!options.render) {
    let template = options.template;
    if (template) {
    } else {
      template = getOuterHtml(el);
    }
    const { render, staticRenderFns } = compileToFunctions(
      template,
      {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments,
      },
      this
    );
    options.render = render;
    options.staticRenderFns = staticRenderFns;
  }
};
// 调用compileToFunctions函数将模板转化成render函数
// compileToFunctions函数出处：
const { compile, compileToFunctions } = createCompiler(baseOptions);
// 创建一个编译器，来源如下
export const createCompiler = createCompilerCreator(function baseCompile(
  template: String,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});

//createCompilerCreator的来源
export function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {};
}
//createCompiler定义
function createCompiler(baseOptions) {
  function compile() {}
  return {
    compile,
    compileToFunctions: createCompileToFunctionFn(compile),
  };
}

//createCompileToFunctionFn的来源定义
export function createCompileToFunctionFn(compile) {
  return function compileToFunctions() {
    const res = {};
    const compiled = compile(template, options);
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map((code) => {
      return createFunction(code, fnGenErrors);
    });
    return res;
  };
}
function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err, code });
    return noop;
  }
}
function compile(template, options) {
  const compiled = baseCompile(template, finalOptions);
  compiled.errors = errors;
  compiled.tips = tips;
  return compiled;
}
function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
}
