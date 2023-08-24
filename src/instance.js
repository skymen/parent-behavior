function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      if (properties) {
      }
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        // data to be saved for savegames
      };
    }

    LoadFromJson(o) {
      // load state for savegames
    }

    Trigger(method) {
      super.Trigger(method);
      const addonTrigger = addonTriggers.find((x) => x.method === method);
      if (addonTrigger) {
        this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id));
      }
    }

    _DoParentLayer(layer, sublayers, opts) {
      const wi = this._inst.GetWorldInfo();
      const rootInstances = layer._instances.filter(
        (x) => x !== this._inst && !x.GetWorldInfo().HasParent()
      );

      for (const instance of rootInstances) {
        wi.AddChild(instance.GetWorldInfo(), opts);
      }

      if (sublayers) {
        for (const sublayer of layer._subLayers) {
          this._DoParentLayer(sublayer, sublayers, opts);
        }
      }
    }

    _InstIsInLayer(inst, layer, sublayers) {
      const wi = inst.GetWorldInfo();
      if (wi.GetLayer() === layer) {
        return true;
      }
      return (
        sublayers &&
        layer.GetSubLayers().some((x) => this._InstIsInSubLayer(inst, x))
      );
    }

    _ParentLayer(
      layer,
      sublayers,
      transformX,
      transformY,
      transformWidth,
      transformHeight,
      transformAngle,
      transformOpacity,
      transformZElevation,
      transformVisibility,
      destroyWithParent
    ) {
      this._DoParentLayer(layer, sublayers, {
        transformX,
        transformY,
        transformWidth,
        transformHeight,
        transformAngle,
        transformZElevation,
        transformOpacity,
        transformVisibility,
        destroyWithParent,
      });
    }
    _RemoveAllChildren() {
      const wi = this._inst.GetWorldInfo();
      const children = wi.GetChildren();
      for (const child of children) {
        wi.RemoveChild(child);
      }
    }
    _RemoveChildrenFromLayer(layer, removeSubLayers) {
      const wi = this._inst.GetWorldInfo();
      const children = wi.GetChildren();
      for (const child of children) {
        if (this._InstIsInLayer(child, layer, removeSubLayers)) {
          wi.RemoveChild(child);
        }
      }
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }
  };
}
