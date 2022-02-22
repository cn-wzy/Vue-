function parseHTML(html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  // 开启循环直至所有html解析完毕
  while (html) {
    last = html;
    // 确保parse内容不是在纯文本标签里的（script， style， textarea）
    if (!lastTag || isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf("<");
      // 判断以<开头的几种可能
      if (textEnd === 0) {
        // 其中很多的代码都在09模板解析.js中有就不在重复打一遍了
        if (comment.test(html)) {
          // 解析是否是注释
        }
        if (conditionalComment.test(html)) {
          // 解析是否是条件注释
        }
        const doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          // 解析是否是DOCTYPE
        }
        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
          // 解析是否是结束标签
        }
        const startTagMatch = parseStartTag();
        if (startTagMatch) {
          // 匹配是否是开始标签
        }
      }
      // 如果不是以<开头，则解析文本类型
      let text, rest, next;
      if (textEnd >= 0) {
        // 如果html字符串不是以<开头，则解析文本类型
      }
      if (textEnd < 0) {
        // 如果没有<则代表纯文本
        text = html;
        html = "";
      }
      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      // 如果是纯文本标签，则作为纯文本处理
    }
    if (html === last) {
      options.chars && options.chars(html);
      if (!stack.length && options.warn) {
        options.warn("sssss");
      }
      break;
    }
  }
  parseEndTag();
  function parseStartTag() {
    // 开始标签
  }
  function handleStartTag(match) {
    // 处理parse
  }
  // parseEndTag函数源码
  function parseEndTag(tagName, start, end) {
    let pos, lowerCasedTagName;
    if (start == null) start = index;
    if (end == null) end = index;
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    if (tagName) {
      // 找到最近的一个同类型的开尖括号
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // 如果没有tagname
      pos = 0;
    }

    if (pos >= 0) {
      // 关闭所有开括号，更新栈
      for (let i = stack.length - 1; i >= pos; i--) {
        if (
          process.env.NODE_ENV != "production" &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn("没有匹配的tag");
        }
        if (options.warn) {
          options.end(stack[i].tag, start, end);
        }
      }
      // 将栈中的开尖括号元素删除
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === "br") {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === "p") {
      if (options.start) {
        options.start(tagName, [], false, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}
