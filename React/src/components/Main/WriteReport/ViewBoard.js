import React, { Component } from "react";
import { Col, Row } from "antd";
import "antd/dist/antd.css";
import marked from "marked";
import highlight from "highlight.js";
import "../../../static/style/common.css";
import "../../../static/style/js-highlight.css";

const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + "</a>";
};

highlight.configure({
  tabReplace: "  ",
  classPrefix: "hljs-",
  languages: [
    "CSS",
    "HTML, XML",
    "JavaScript",
    "PHP",
    "Python",
    "Stylus",
    "TypeScript",
    "Markdown",
  ],
});
marked.setOptions({
  highlight(code) {
    return highlight.highlightAuto(code).value;
  },
});

class ViewBoard extends Component {
  state = {
    width: "60vw",
    height:
      !this.props.height || this.props.height.length === 0
        ? "60vh"
        : this.props.height,
  };
  render() {
    return (
      <div
        class="preview"
        style={{
          "text-align": "left",
          background: "white",
          overflow: "scroll",
          "font-size": "12px",
          height: this.state.height,
          "margin-top": 10,
          width: "100%",
        }}
        dangerouslySetInnerHTML={{
          __html: marked(this.props.content, {}),
        }}
      />
    );
  }
}

export default ViewBoard;
