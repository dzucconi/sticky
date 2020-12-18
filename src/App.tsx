import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { FrameInterval } from "frame-interval";
import { stickyCaps } from "./lib/stickyCaps";
import "./App.css";

type State = {
  message: string;
  fps: number;
  probability: number;
  fontSize: number;
  backgroundColor: string;
  uppercaseColor: string;
  lowercaseColor: string;
  fontFamily: "proportional" | "monospaced";
};

enum Type {
  Update,
}

type Action = {
  type: Type.Update;
  payload: Partial<State>;
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case Type.Update:
      return { ...state, ...action.payload };
  }
};

export const App = () => {
  const [toggled, setToggle] = useState(true);

  const [state, dispatch] = useReducer(reducer, {
    message: "Una rosa blanca de metal",
    fps: 24,
    probability: 0.5,
    fontSize: 100,
    backgroundColor: "black",
    uppercaseColor: "white",
    lowercaseColor: "white",
    fontFamily: "proportional",
  });

  const ref = useRef<HTMLDivElement | null>(null);

  const fi = useMemo(() => {
    return new FrameInterval(state.fps, () => {
      if (!ref.current) return;
      ref.current.innerHTML = stickyCaps(state.message, {
        probability: state.probability,
        lowercaseColor: state.lowercaseColor,
        uppercaseColor: state.uppercaseColor,
      });
    });
  }, [
    state.fps,
    state.lowercaseColor,
    state.message,
    state.probability,
    state.uppercaseColor,
  ]);

  useEffect(() => {
    fi.start();
    return () => {
      fi.stop();
    };
  }, [fi]);

  const handleClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  return (
    <div className="App">
      <div
        className="Stage"
        ref={ref}
        style={{
          backgroundColor: state.backgroundColor,
          fontSize: `${state.fontSize}px`,
          fontFamily: {
            proportional: `"Helvetica Neue", Helvetica, sans-serif`,
            monospaced: `"Helvetica Monospaced", monospaced`,
          }[state.fontFamily],
        }}
      >
        {state.message}
      </div>

      <div className="Controls">
        <button className="Controls__toggle" onClick={handleClick} />

        {toggled && (
          <>
            <div className="Control">
              <label className="Control__label" htmlFor="fps">
                FPS ({state.fps})
              </label>
              <input
                id="fps"
                name="fps"
                type="range"
                min="0"
                max="60"
                step="1"
                defaultValue={state.fps}
                onChange={(event) => {
                  dispatch({
                    type: Type.Update,
                    payload: {
                      fps: parseInt(event.currentTarget.value, 10),
                    },
                  });
                }}
              />
            </div>

            <div className="Control">
              <label className="Control__label" htmlFor="fontSize">
                Font size ({state.fontSize}px)
              </label>
              <input
                id="fontSize"
                name="fontSize"
                type="range"
                min="1"
                max="500"
                step="1"
                defaultValue={state.fps}
                onChange={(event) => {
                  dispatch({
                    type: Type.Update,
                    payload: {
                      fontSize: parseInt(event.currentTarget.value, 10),
                    },
                  });
                }}
              />
            </div>

            <div className="Control">
              <label className="Control__label" htmlFor="fontSize">
                Font family ({state.fontFamily})
              </label>
              <select
                id="fontFamily"
                name="fontFamily"
                defaultValue={state.fontFamily}
                onChange={(event) => {
                  dispatch({
                    type: Type.Update,
                    payload: {
                      fontFamily:
                        event.currentTarget.value === "proportional"
                          ? "proportional"
                          : "monospaced",
                    },
                  });
                }}
              >
                <option>proportional</option>
                <option>monospaced</option>
              </select>
            </div>

            <div className="Control">
              <label className="Control__label" htmlFor="probability">
                Probability (Upper &lt;({state.probability})&gt; Lower)
              </label>
              <input
                id="probability"
                name="probability"
                type="range"
                defaultValue={state.probability}
                min="0"
                max="1"
                step="0.01"
                onChange={(event) => {
                  dispatch({
                    type: Type.Update,
                    payload: {
                      probability: parseFloat(event.currentTarget.value),
                    },
                  });
                }}
              />
            </div>

            <div className="Control">
              <fieldset className="Control__fieldset">
                <div className="Control__sub">
                  <label className="Control__label" htmlFor="uppercaseColor">
                    Uppercase color
                  </label>
                  <input
                    id="uppercaseColor"
                    name="uppercaseColor"
                    type="color"
                    defaultValue={state.uppercaseColor}
                    onChange={(event) => {
                      dispatch({
                        type: Type.Update,
                        payload: {
                          uppercaseColor: event.currentTarget.value,
                        },
                      });
                    }}
                  />
                </div>

                <div className="Control__sub">
                  <label className="Control__label" htmlFor="lowercaseColor">
                    Lowercase color
                  </label>
                  <input
                    id="lowercaseColor"
                    name="lowercaseColor"
                    type="color"
                    defaultValue={state.lowercaseColor}
                    onChange={(event) => {
                      dispatch({
                        type: Type.Update,
                        payload: {
                          lowercaseColor: event.currentTarget.value,
                        },
                      });
                    }}
                  />
                </div>
              </fieldset>
            </div>

            <div className="Control">
              <label className="Control__label" htmlFor="message">
                Message
              </label>
              <input
                id="message"
                name="message"
                defaultValue={state.message}
                autoFocus
                onChange={(event) => {
                  dispatch({
                    type: Type.Update,
                    payload: {
                      message: event.currentTarget.value,
                    },
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
