import React from "react";
import marked from "marked";
import highlight from "highlight.js";
import { Button, Tooltip, Row, Col, Popover, Switch, Select } from "antd";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import CodemirrorEditor, { CodemirrorHandler } from "../CodemirrorEditor";

//reference: https://www.npmjs.com/package/codemirror
//快捷键支持
// 搜索(search) Ctrl-F (PC), Cmd-F (Mac)
// 替换(replace)   Shift-Ctrl-F (PC), Cmd-Alt-F (Mac)
// 替换全部(replaceAll)   Shift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)
// 光标定位(locate cursor): Alt-G，例如输入 9:26，则光标定位到第9行第26列
// 搜索或者跳转行数出现的弹出框样式

// 当输入 '>' 或 '/' 字符的时候, 自动关闭标签
// 当光标定位于编辑器内，并且按 F11的时候编辑框全屏
// 全屏样式

require("codemirror/lib/codemirror.css");
require("codemirror/theme/solarized.css");
require("codemirror/addon/search/search");
require("codemirror/addon/search/jump-to-line");
require("codemirror/addon/dialog/dialog.css");
require("codemirror/addon/edit/closetag");
require("codemirror/addon/display/fullscreen");
require("codemirror/addon/display/fullscreen.css");
require("codemirror/theme/monokai.css");

require("codemirror/mode/javascript/javascript");
require("codemirror/mode/jsx/jsx");
require("codemirror/mode/css/css");
require("codemirror/mode/sass/sass");
require("codemirror/mode/xml/xml");
require("codemirror/mode/markdown/markdown");

require("../../../static/style/common.css");
require("../../../static/style/js-highlight.css");
require("./style.css");

/**
 * This is a new version of write and view board, which provides functionalities of colorful coding and synchronized scrolling
 * fully controller component
 * example use case:
 * <WriteAndViewBoard3
            setContent={this.setContent.bind(this)}
            setDefaultContent={this.setDefaultContent.bind(this)}
            setTheme={this.setTheme.bind(this)}
            integratedContent={this.props.integratedContent}
            content={this.state.content}
            defaultText={defaultText}
            theme={this.state.theme}
  ></WriteAndViewBoard3>
 */


 
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
  gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      // sanitize: true,
      smartLists: true,
      smartypants: false,
      langPrefix: 'hljs ',
  highlight(code) {
    return highlight.highlightAuto(code).value;
  },
});

const { Option } = Select;


export default class WriteAndViewBoard3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aceBoxH: null,
      isFullScreen: false,
      currentTabIndex: 1,
      hasContentChanged: false,
      scale: 1,
      shortCutsHintsShown: false,
      codeTheme: "solarized",
      viewBoardStyle: {
        "background-color": "#fff",
        color: "#333",
        transition: "background-color 0.3s ease",
      },
      fontSize:12
    };
    this.cacheValue();
    this.fullScreen = this.fullScreen.bind(this);
    this.requestFullScreen = this.requestFullScreen.bind(this);
    this.exitFullscreen = this.exitFullscreen.bind(this);
    this.watchFullScreen = this.watchFullScreen.bind(this);
    this.escFunction = this.escFunction.bind(this);
    document.addEventListener("keydown", this.escFunction, false);
    this.onContentChange = this.onContentChange.bind(this);
  }

  handleVisibleChange = (shortCutsHintsShown) => {
    this.setState({ shortCutsHintsShown });
  };

  changeTheme() {
    // themes = ['solarized','monokai']; If more themes, need to refine this function
    console.log("enter change theme");
    
    if (this.state.codeTheme === "monokai") {
      this.setState({ codeTheme: "solarized" });
      // this.setState({viewBoardStyle:{
      //   "background-color": "#fff",
      //   color: "white",
      //   transition: "background-color 0.3s ease",
      // }});
    } else if (this.state.codeTheme === "solarized") {
      this.setState({ codeTheme: "monokai" });
      // this.setState({
      //   viewBoardStyle: { "background-color": "#1a1919", color: "#999" },
      // });
    }
  }

  changeFontSize = (value) => {
    console.log("font size: ", value);
    this.setState({fontSize :value})
  }

  render() {
    let state = this.state
    const shortcutHints = (
      <div>
        <p>搜索(search): Ctrl-F (PC), Cmd-F (Mac)</p>
        <p>替换(replace) Shift-Ctrl-F (PC), Cmd-Opt-F (Mac)</p>
        <p>替换全部(replaceAll) Shift-Ctrl-R (PC), Shift-Cmd-Opt-F (Mac)</p>
        <p>
          光标定位(locate cursor): Alt-G (PC), Opt-G (Mac)，for example
          9:26，move to row 9 col 26
        </p>
      </div>
    );
    const renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
      return `<a target="_blank" rel="noopener noreferrer" href="${ href }" title="${ title }">${ text }</a>`;
    };
    const html = marked(this.props.content || '', { renderer });
    return [
      <div data-tut="tour_writeAndViewBoard_writeAndViewBoard">
        <Row style={{ backgroundColor: "white" }} justify="start">
          <Col>
            <Popover
              content={shortcutHints}
              trigger="click"
              visible={this.state.shortCutsHintsShown}
              onVisibleChange={this.handleVisibleChange}
            >
              <Button size="small" icon={<QuestionOutlined />}>
                Shortcuts
              </Button>
            </Popover>
          </Col>
          <Col>
            <Button
              size="small"
              data-tut="tour_writeAndViewBoard_fullScreen"
              onClick={this.fullScreen}
              icon={
                !this.state.isFullScreen ? (
                  <FullscreenOutlined />
                ) : (
                  <FullscreenExitOutlined />
                )
              }
            >
              Full Screen
            </Button>
          </Col>
          {/* change front size */}
          <Col>
          <Select defaultValue={12} size="small" style={{ width: 60 }} onChange={this.changeFontSize}>
            <Option value={8}>8</Option>
            <Option value={12}>12</Option>
            <Option value={14}>14</Option>
            <Option value={18}>18</Option>
            <Option value={24}>24</Option>
            <Option value={36}>36</Option>
    </Select>
          </Col>
          <Col>
            <Switch
              size="medium"
              checkedChildren="light"
              unCheckedChildren="dark"
              defaultChecked
              onClick={() => this.changeTheme()}
            />
          </Col>
          
        </Row>
        <header className="edit-header" key="header">
          <input
            style={{
              "text-align": "left",
              background: "white",
              "font-size": "18px",
              "padding-left":"40px"
            }}
            type="text"
            className="title-input"
            placeholder="Must enter a title"
            value={this.props.theme ? this.props.theme : ""}
            spellCheck="true"
            onChange={(e) => {
              this.props.setTheme(e.target.value);
            }}
          />
        </header>
        <div
          id="main"
          className="editor-main-c"
          ref={(node) => (this.aceBox = node)}
          style={{
            height: state.editorBoxH + 'px',
            minHeight: "700px",
            "text-align": "left",
            background: "white",
            padding: 5,
            "font-size": state.fontSize,
            "white-space": "normal", //solve safari not-change-line issue
          }}
          key="main"
        >
          <Tooltip title="Markdown Writer">
            <div
              className="common-container editor-container"
              onMouseOver={this.setCurrentIndex.bind(this, 1)}
              ref={(node) => (this.editContainer = node)}
            >
              {state.editorBoxH &&
              <CodemirrorEditor
                onScroll={this.containerScroll.bind(this, 1)}
                onChange={this.onContentChange}
                ref="editor"
                options={{
                  lineNumbers: true,
                  theme: this.state.codeTheme,
                  tabSize: 2,
                  lineWrapping: true,
                  readOnly: false,
                  mode: "markdown",
                  // codemirror/addon/edit/closetag
                  autoCloseTags: true,
                  // diy shortcuts
                  extraKeys: this.setExtraKeys(),
                }}
                autoFocus={true}
                value={this.props.content}
              />
              }
            </div>
          </Tooltip>
          <Tooltip title="Preview">
            <div

              className="common-container preview-container"
              ref={(node) => (this.previewContainer = node)}
              onMouseOver={this.setCurrentIndex.bind(this, 2)}
              onScroll={this.containerScroll.bind(this, 2)}
              // style={this.state.viewBoardStyle}
            >
              <div
                style={{
                  "text-align": "left",
                  "margin-top": 5,
                  "font-size": state.fontSize,
                }}
                className="markdown-body preview-wrapper"
                ref={(node) => (this.previewWrap = node)}
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              ></div>
            </div>
          </Tooltip>
        </div>
      </div>,
    ];
  }

  componentDidMount() {
    this.setState({
      editorBoxH:
        document.documentElement.clientHeight -
        document.querySelector(".edit-header").offsetHeight,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  //update left writing board by determin whether current content is the same with props'
  // componentDidUpdate() {
  //   if (this.props.content !== this.state.content) {
  //     console.log("update: ", this.props.content);
  //     this.setState({ content: this.props.content });
  //   }
  // }

  //helper function for auto focus scrolling
  cacheValue() {
    this.currentTabIndex = 1;
    this.hasContentChanged = false;
    this.scale = 1;
  }

  //helper function for auto focus scrolling
  setCurrentIndex(index) {
    this.setState({
      currentTabIndex: index,
    });
  }

  // help determine the position of scrolling

  containerScroll(index, e) {
    let state = this.state;
    state.hasContentChanged && this.setScrollValue();
    if (state.currentTabIndex === 1 && index === 1) {
      this.previewContainer.scrollTop = e.top * state.scale;
    } else if (state.currentTabIndex === 2 && index === 2) {
      CodemirrorHandler.scrollTo(
        null,
        this.previewContainer.scrollTop / state.scale
      );
    }
  }

  // handle content change
  onContentChange(newCode) {
    this.props.setContent(newCode);
    !this.state.hasContentChanged && this.setState({ hasContentChanged: true });
  }

  //use ratio to determine how manny we need to scroll
  setScrollValue() {
    let containerH = this.previewContainer.offsetHeight;
    this.setState({
      scale:
        (this.previewWrap.offsetHeight - containerH) /
        (CodemirrorHandler.getScrollInfo().height - containerH),
      hasContentChanged: false,
    });
  }

  /**
   * full screen support
   */
  fullScreen() {
    if (!this.state.isFullScreen) {
      this.requestFullScreen();
    } else {
      this.exitFullscreen();
    }
    this.setState({
      isFullScreen: false,
    });
  }

  requestFullScreen() {
    var dom = document.getElementById("main");
    if (dom.requestFullscreen) {
      dom.requestFullscreen();
    } else if (dom.mozRequestFullScreen) {
      dom.mozRequestFullScreen();
    } else if (dom.webkitRequestFullScreen) {
      dom.webkitRequestFullScreen();
    }
  }

  exitFullscreen() {
    var dom = document.getElementById("main");
    if (dom.exitFullscreen) {
      dom.exitFullscreen();
    } else if (dom.mozCancelFullScreen) {
      dom.mozCancelFullScreen();
    } else if (dom.webkitCancelFullScreen) {
      dom.webkitCancelFullScreen();
    }
  }
  watchFullScreen() {
    console.log(document.webkitIsFullScreen);
    const _self = this;
    document.addEventListener(
      "webkitfullscreenchange",
      function() {
        _self.setState({
          isFullScreen: document.webkitIsFullScreen,
        });
      },
      false
    );
  }

  setExtraKeys() {
    // 自定义快捷键
    const that = this;
    let appendTxtFn = () => {
      let resultObj = {};
      let key2Command = [
        { name: "Ctrl-H", value: "## ", offset: 0 },
        { name: "Ctrl-B", value: "**", offset: 1 },
        { name: "Ctrl-K", value: "[]()", offset: 3 },
        { name: "Alt-K", value: "``", offset: 1 },
        { name: "Alt-C", value: "```js\n\n```", offset: 0, offsetLine: 1 },
        { name: "Alt-I", value: "![alt]()", offset: 1 },
        { name: "Alt-L", value: "* ", offset: 0 },
      ];
      key2Command.forEach((item, index) => {
        resultObj[item.name] = (cm) => {
          that.setCursor(cm, item.value, item.offset, item.offsetLine);
        };
      });
      return resultObj;
    };
    let otherKeys = {
      F11(cm) {
        // 全屏
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      Esc(cm) {
        // 退出全屏
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      },
    };
    return Object.assign(otherKeys, appendTxtFn());
  }

  setCursor(cm, appendValue, offset = 0, offsetLine = 0) {
    let newValue = cm.getValue() + appendValue;
    cm.setValue(newValue);
    let lastLine = cm.lastLine() - offsetLine;
    cm.setCursor(lastLine, cm.getLine(lastLine).length - offset);
    this.onContentChange(newValue);
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      console.log("esc pressed");
      this.setState({ isFullScreen: false });
    }
  }
}
