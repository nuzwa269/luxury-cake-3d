"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { SceneStill } from "./SceneStill";

const ClientScene = dynamic(() => import("./CakeScene"), {
  ssr: false,
  loading: () => <SceneStill />,
});

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SceneStill failed /> : this.props.children;
  }
}

export function CakeSceneLoader() {
  return (
    <SceneBoundary>
      <ClientScene />
    </SceneBoundary>
  );
}
