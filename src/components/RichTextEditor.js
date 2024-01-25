import React, { useState, useEffect } from "react";
import '../App.css'
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

export const RichTextEditor = () => {
  const [cursor, setCursor] = useState(false);
  const [tempState, setTempState] = useState("");
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
  }, [editorState]);

  const handleBeforeInput = (chars) => {
    if (chars === "*") {
      if (tempState === "#") setTempState("*");
      else setTempState(`${tempState}*`);
    } else if (chars === "#") {
      setTempState("#");
    } else {
      setTempState("");
    }

    if (chars === " ") {
      if (tempState === "*") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
        setCursor(true);
        return "handled";
      }
      if (tempState === "**") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "COLOR-RED"));
        setCursor(true);
        return "handled";
      }
      if (tempState === "***") {
        setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
        setCursor(true);
        return "handled";
      }
      if (tempState === "#") {
        setEditorState(
          RichUtils.toggleBlockType(editorState, "header-one")
        );
        return "handled";
      }
    }
    if (chars === "*" || chars === "#") {
      return "handled";
    }

    return "not-handled";
  };

  const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === "header-one") {
      return "header-one";
    }
  };
  const customStyleMap = {
    "COLOR-RED": { color: "red" },
    UNDERLINE: { textDecoration: "underline" },
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
    alert("Content saved successfully!");
  };

  return (
    <div>
      <div>
        <h2>Title</h2>
      </div>
      <div>
        <Editor
          editorState={editorState}
          onChange={(newState) => setEditorState(newState)}
          handleBeforeInput={(chars) => handleBeforeInput(chars)}
          blockStyleFn={blockStyleFn}
          customStyleMap={customStyleMap}
        />
        <br/>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};
