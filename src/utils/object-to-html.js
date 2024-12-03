function nestedObjhandler(data, depthCount) {
  let arr = [];
  Object.entries(data).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      arr.push({ val: `${key} : {`, depth: depthCount });
      const nested = nestedObjhandler(value, depthCount + 1); // Recursive call
      arr = [...arr, ...nested.array];
      arr.push({ val: `},`, depth: depthCount });
    } else {
      arr.push({ val: `${key} : ${value == null ? "null" : value}`, depth: depthCount });
    }
  });

  return { array: arr };
}

export function convertObjToHtml(data) {
  let html_code = [];
  html_code.push({ val: "{", depth: 0 });

  if (data && typeof data === "object") {
    const { array } = nestedObjhandler(data, 1);
    html_code = [...html_code, ...array];
  } else {
    const value = data == null ? "null" : data;
    html_code.push({ val: value, depth: 0 });
  }
  html_code.push({ val: `}`, depth: 0 });

  let _html = "";
  html_code.forEach((i) => {
    _html += `<p>`;
    for (let p = 0; p < i.depth; p++) {
      _html += `&nbsp;`;
    }
    _html += `${i.val}</p>`;
  });

  return _html;
}
