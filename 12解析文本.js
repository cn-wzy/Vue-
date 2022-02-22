// 判断<的位置，在第一个则是其他类型标签，否则为文本标签
let textEnd = html.indexOf("<");
if (textEnd === 0) {
  // ...
}
if (textEnd >= 0) {
  rest = html.slice(textEnd);
  // 用<以后的内容匹配四种标签，若都不对则为文本内容
  while (
    (!endTag,
    test(rest) &&
      !startTagOpen.test(rest) &&
      !comment.test(rest) &&
      !conditionalComment.test(rest))
  ) {
    next = rest.indexOf("<", 1);
    if (next < 0) break;
    textEnd += nextrest = html.slice(textEnd);
  }
  text = html.substring(0, textEnd);
  advance(textEnd);
}
// 如果整个模板字符串没有找到<,说明整个模板字符串都是文本
if (textEnd < 0) {
  text = html;
  html = "";
}
if (options.chars && text) {
  options.chars(text);
}
