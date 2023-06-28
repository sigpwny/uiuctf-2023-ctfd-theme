import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

class Pane {
  constructor(params) {
    // Check required parameters
    if (!params.name) throw new Error("Pane must have a name");
    if (!params.desktop) throw new Error("Pane must be linked to a Desktop");
    if (!params.title) throw new Error("Pane must have a title");
    if (!params.initial_body_elem)
      throw new Error("Pane must have initial body element");
    this.name = params.name;
    this.desktop = params.desktop;
    this.title = params.title;
    this.taskbar_title = params.taskbar_title ?? params.title;
    this.initial_body_elem = params.initial_body_elem;
    this.icon_path = params.icon_path ?? null;
    this.hide_minimize = params.hide_minimize ?? false;
    this.hide_maximize = params.hide_maximize ?? false;
    this.hide_close = params.hide_close ?? false;
    this.disable_drag = params.disable_drag ?? false;
    this.disable_resize = params.disable_resize ?? false;
    this.#createPaneDOM();

    // Dynamic attributes
    this.transform =
      params.transform ?? `translate(${params.x ?? 0}px, ${params.y ?? 0}px)`;
    this.z = params.z ?? 0;
    this.width = params.width ?? null;
    this.height = params.height ?? null;
    this.minimized = params.minimized ?? false;
    this.maximized = params.maximized ?? false;
    this.focused = params.focused ?? false;

    this.moveable = new Moveable(document.body, {
      target: this.target,
      dragTarget: this.handle ?? null,
      // Draggable options
      draggable: !this.maximized && !this.disable_drag,
      throttleDrag: 1,
      edgeDraggable: false,
      startDragRotate: 0,
      throttleDragRotate: 0,
      edge: true,
      origin: false,
      // Resizable options
      resizable: !this.maximized && !this.disable_resize,
      throttleResize: 1,
      keepRatio: false,
      renderDirections: ["nw", "ne", "se", "sw"],
    });
    this.#registerListeners();
    this.#commitDOM();
    if (this.transform === "center") {
      this.transform = `translate(${
        (this.desktop.elem.offsetWidth - this.target.offsetWidth) / 2
      }px, ${(this.desktop.elem.offsetHeight - this.target.offsetHeight) / 2}px)`;
    }
    this.render();
  }

  #createPaneDOM() {
    // Ensure xref_target is unique
    let uniq, xref_target;
    do {
      uniq = Math.random().toString(16).slice(2);
      xref_target = `${this.name}_${uniq}`;
    } while (document.querySelector(`[x-ref="${xref_target}"]`));
    const xref_target_handle = `${xref_target}_handle`;
    const xref_target_taskbar_button = `${xref_target}_taskbar_button`;

    // Create pane parent
    const pane_elem = document.createElement("div");
    pane_elem.setAttribute("x-ref", xref_target);
    pane_elem.setAttribute("class", "card pane flex-column");

    // Create handle
    const pane_handle = document.createElement("div");
    pane_handle.setAttribute("x-ref", xref_target_handle);
    pane_handle.setAttribute(
      "class",
      "card-header d-flex flex-row justify-content-between align-items-center"
    );
    const pane_title = document.createElement("div");
    pane_title.setAttribute("class", "card-header-content");
    // TODO: Icon
    pane_title.appendChild(document.createTextNode(this.title));
    pane_handle.appendChild(pane_title);

    // Create pane controls
    const pane_controls = document.createElement("div");
    pane_controls.setAttribute("class", "d-flex flex-row");
    if (!this.hide_minimize) {
      pane_controls.insertAdjacentHTML(
        "beforeend",
        `
        <div class="pane-control-icon" x-ref="minimize">
          <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/minimize.png">
          <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/minimize_pressed.png">
        </div>
      `
      );
    }
    if (!this.hide_maximize) {
      pane_controls.insertAdjacentHTML(
        "beforeend",
        `
        <span x-ref="maximize-restore-group">
          <div class="pane-control-icon" x-ref="maximize">
            <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/maximize.png" alt="">
            <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/maximize_pressed.png" alt="">
          </div>
          <div class="pane-control-icon" x-ref="restore">
            <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/restore.png" alt="">
            <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/restore_pressed.png" alt="">
          </div>
        </span>
      `
      );
    }
    if (!this.hide_close) {
      pane_controls.insertAdjacentHTML(
        "beforeend",
        `
        <div class="pane-control-icon close-icon" x-ref="close">
          <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/close.png" alt="">
          <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win95-pane-control/close_pressed.png" alt="">
        </div>
      `
      );
    }
    pane_handle.appendChild(pane_controls);
    pane_elem.appendChild(pane_handle);

    // Create pane body
    const pane_body = document.createElement("div");
    pane_body.setAttribute("class", "card-body");
    pane_body.insertAdjacentHTML("beforeend", this.initial_body_elem);
    pane_elem.appendChild(pane_body);

    // Create taskbar button
    const taskbar_button = document.createElement("li");
    taskbar_button.setAttribute("class", "nav-item taskbar-button");
    const taskbar_button_link = document.createElement("a");
    taskbar_button_link.setAttribute("x-ref", xref_target_taskbar_button);
    taskbar_button_link.setAttribute("class", "nav-link d-flex flex-row");
    taskbar_button_link.setAttribute("role", "button");
    const taskbar_button_icon = document.createElement("img");
    taskbar_button_icon.setAttribute("class", "taskbar-icon");
    if (this.icon_path) taskbar_button_icon.setAttribute("src", this.icon_path);
    const taskbar_button_text = document.createElement("div");
    taskbar_button_text.innerText = this.taskbar_title;
    taskbar_button_link.appendChild(taskbar_button_icon);
    taskbar_button_link.appendChild(taskbar_button_text);
    taskbar_button.appendChild(taskbar_button_link);

    // Set created elements
    this.target = pane_elem;
    this.handle = pane_handle;
    this.taskbar_button = taskbar_button_link;
  }

  /**
   * Registers event listeners for all components used to control the pane
   */
  #registerListeners() {
    this.moveable.on("drag", e => {
      e.target.style.transform = e.transform;
      if (this.maximized) this.setMaximized(false);
    });
    this.moveable.on("resize", e => {
      e.target.style.transform = e.transform;
      e.target.style.width = `${e.width}px`;
      e.target.style.height = `${e.height}px`;
    });
    this.moveable.on("dragStart", e => {
      this.desktop.bringToFront(this.target);
    });
    this.moveable.on("resizeStart", e => {
      this.desktop.bringToFront(this.target);
    });
    this.moveable.on("dragEnd", e => {
      if (!this.maximized) {
        this.transform = e.target.style.transform;
      }
      this.desktop.save();
    });
    this.moveable.on("resizeEnd", e => {
      this.transform = e.target.style.transform;
      this.width = e.target.style.width;
      this.height = e.target.style.height;
      this.desktop.save();
    });
    // If any part of the pane is clicked, bring it to the front
    this.target.addEventListener("click", () => {
      this.desktop.bringToFront(this.target);
    });
    // Maximize/restore on handle double click
    this.handle.addEventListener("dblclick", () => {
      this.setMaximized(!this.maximized);
      this.render();
      this.desktop.save();
    });
    // Minimize buttons
    this.target.querySelectorAll("div[x-ref='minimize']").forEach(elem =>
      elem.addEventListener("click", event => {
        this.setMinimized(true);
        event.stopImmediatePropagation();
      })
    );
    // Maximize buttons
    this.target.querySelectorAll("div[x-ref='maximize']").forEach(elem =>
      elem.addEventListener("click", event => {
        this.setMaximized(true);
        event.stopImmediatePropagation();
      })
    );
    // Restore buttons
    this.target.querySelectorAll("div[x-ref='restore']").forEach(elem =>
      elem.addEventListener("click", event => {
        this.setMaximized(false);
        this.desktop.bringToFront(this.target);
        event.stopImmediatePropagation();
      })
    );
    // Close buttons
    this.target.querySelectorAll("[x-ref='close']").forEach(elem =>
      elem.addEventListener("click", () => {
        this.close();
      })
    );
    // Swap maximize/restore buttons on maximize-restore-group
    this.target.querySelectorAll("[x-ref='maximize-restore-group']").forEach(elem =>
      elem.addEventListener("click", () => {
        const button_maximize = elem.querySelector("[x-ref='maximize']");
        const button_restore = elem.querySelector("[x-ref='restore']");
        if (this.maximized) {
          button_maximize.style.display = "none";
          button_restore.style.display = "block";
        } else {
          button_maximize.style.display = "block";
          button_restore.style.display = "none";
        }
      })
    );
    // Taskbar button
    if (this.taskbar_button) {
      this.taskbar_button.addEventListener("click", () => {
        this.desktop.bringToFront(this.target);
        this.setMinimized(false);
      });
    }
  }

  #commitDOM() {
    this.desktop.elem.appendChild(this.target);
    if (this.taskbar_button) this.desktop.taskbar.appendChild(this.taskbar_button);
  }

  #removeDOM() {
    this.desktop.elem.removeChild(this.target);
    if (this.taskbar_button) this.desktop.taskbar.removeChild(this.taskbar_button);
  }

  /**
   * Generate JSON representation of the pane's state for storing
   * @returns {object} JSON object representing the state of the pane
   */
  toJSON() {
    return {
      name: this.name,
      title: this.title,
      taskbar_title: this.taskbar_title,
      initial_body_elem: this.initial_body_elem,
      icon_path: this.icon_path,
      hide_minimize: this.hide_minimize,
      hide_maximize: this.hide_maximize,
      hide_close: this.hide_close,
      disable_drag: this.disable_drag,
      disable_resize: this.disable_resize,
      transform: this.transform,
      z: this.z,
      width: this.width,
      height: this.height,
      minimized: this.minimized,
      maximized: this.maximized,
      focused: this.focused,
    };
  }

  /**
   * Closes the pane by removing its elements from the DOM and desktop state
   */
  close() {
    this.desktop.panes = this.desktop.panes.filter(p => p !== this);
    this.desktop.save();
    this.#removeDOM();
  }

  /**
   * Sets the z-index of the pane and updates the DOM
   * @param {number} value Z-index to set
   */
  setZ(value) {
    this.z = value;
    this.render();
    this.desktop.save();
  }

  /**
   * Sets the minimized state of the pane and updates the DOM
   * @param {boolean} value True if pane should be hidden, false to use previous state
   */
  setMinimized(value) {
    if (this.hide_minimize) return;
    this.minimized = value;
    if (value) this.focused = false;
    this.render();
    this.desktop.save();
  }

  /**
   * Sets the maximized state of the pane and updates the DOM
   * @param {boolean} value True if pane should be maximized, false to use previous state
   */
  setMaximized(value) {
    if (this.hide_maximize) return;
    this.maximized = value;
    this.moveable.draggable = !value && !this.disable_drag;
    this.moveable.resizable = !value && !this.disable_resize;
    this.render();
    this.desktop.save();
  }

  /**
   * Sets whether the pane is focused or not
   * @param {boolean} value True if the pane is focused, false if not
   */
  setFocused(value) {
    this.focused = value;
    this.render();
    this.desktop.save();
  }

  /**
   *  Updates the DOM to reflect the current state of the pane
   */
  render() {
    // Set z-indices of pane and moveable controls
    this.target.style.zIndex = this.z;
    this.moveable.selfElement.style.zIndex = this.z;
    // Swap maximize/restore buttons
    this.target.querySelectorAll("[x-ref='maximize-restore-group']").forEach(elem => {
      const button_maximize = elem.querySelector("[x-ref='maximize']");
      const button_restore = elem.querySelector("[x-ref='restore']");
      if (this.maximized) {
        button_maximize.style.display = "none";
        button_restore.style.display = "block";
      } else {
        button_restore.style.display = "none";
        button_maximize.style.display = "block";
      }
    });
    if (this.maximized) {
      this.target.style.transform = `translate(0px, 0px)`;
      this.target.style.width = "100%";
      this.target.style.height = "100%";
    } else {
      this.target.style.transform = this.transform;
      this.target.style.width = this.width;
      this.target.style.height = this.height;
    }
    if (this.minimized) {
      this.target.style.display = "none";
    } else {
      this.target.style.display = "flex";
    }
    // Set color of focused pane handle
    if (this.focused) {
      this.target.classList.add("card-tertiary");
      if (this.taskbar_button) this.taskbar_button.classList.add("pane-focused");
    } else {
      this.target.classList.remove("card-tertiary");
      if (this.taskbar_button) this.taskbar_button.classList.remove("pane-focused");
    }
    this.moveable.updateRect();
  }
}

class Desktop {
  constructor(params) {
    if (!params.id) throw new Error("Desktop must have an ID");
    if (!params.elem) throw new Error("Desktop must be linked to an element");
    if (!params.taskbar) throw new Error("Desktop must be linked to a taskbar");
    this.id = params.id;
    this.elem = params.elem;
    this.taskbar = params.taskbar;
    this.x_next = 30;
    this.y_next = 30;
    this.z_next = 1000;
    this.max_panes = 32;
    this.panes = [];
    // TODO
    // this.first_load = true;
    // this.user = "";
    this.restore();
  }

  createPane(pane_options) {
    if (this.panes.length > this.max_panes) {
      this.reset();
      return;
    }
    pane_options.desktop = this;
    pane_options.z = this.z_next;
    this.z_next += 1;
    if (!pane_options.transform && !pane_options.x && !pane_options.y) {
      pane_options.transform = `translate(${this.x_next}px, ${this.y_next}px)`;
      this.x_next += 30;
      this.y_next += 30;
      if (this.x_next > 500) this.x_next = this.x_next % 100;
      if (this.y_next > 500) this.y_next = this.y_next % 100;
    }
    // Create pane
    const pane = new Pane(pane_options);
    this.panes.push(pane);
    this.bringToFront(pane.target);
  }

  bringToFront(pane_target) {
    const idx = this.panes.findIndex(p => p.target === pane_target);
    if (idx < 0) return;
    const pane = this.panes[idx];
    const pane_z_old = pane.z;
    // Find all panes with z-index > pane_z_old and decrement them
    this.panes.forEach(p => {
      p.setFocused(false);
      if (p.z > pane_z_old) p.setZ(p.z - 1);
    });
    // Set new active pane to top
    pane.setFocused(true);
    pane.setZ(this.z_next - 1);
  }

  markAllUnfocused() {
    this.panes.forEach(p => p.setFocused(false));
  }

  save() {
    localStorage.setItem(`desktop-${this.id}`, JSON.stringify(this.panes));
  }

  restore() {
    const saved_panes = JSON.parse(localStorage.getItem(`desktop-${this.id}`));
    if (!saved_panes) return;
    if (saved_panes.length > this.max_panes) {
      this.reset();
      return;
    }
    saved_panes.forEach(saved_pane => this.createPane(saved_pane));
  }

  reset() {
    localStorage.removeItem(`desktop-${this.id}`);
    window.location.reload();
  }

  createAlertPane(title, content) {
    const elem = `
      <div class="d-flex flex-row user-select-none">
        <div class="m-2">
          <img class="flex-shrink-0" src="/themes/uiuctf-2023-ctfd-theme/static/img/win98-icons/msg_error-0.png">
        </div>
        <div class="m-2">
          <p>
            ${content}
          </p>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-center">
        <button class="btn btn-sm btn-primary" x-ref="close">
          <span>OK</span>
        </button>
      </div>
    `;
    this.createPane({
      name: "alert",
      title: title,
      taskbar_title: "Error",
      initial_body_elem: elem,
      icon_path:
        "/themes/uiuctf-2023-ctfd-theme/static/img/win98-icons/msg_error-0.png",
      hide_minimize: true,
      hide_maximize: true,
      hide_close: false,
      disable_resize: true,
      transform: "center",
    });
  }

  createLoginPane() {
    const elem = `
      {% with form = Forms.auth.LoginForm() %}
      <form action="/login" method="post" accept-charset="utf-8" autocomplete="off" class="pb-2 user-select-none">
        <div class="d-flex flex-row">
          <div class="px-4 py-1">
            <img src="/themes/uiuctf-2023-ctfd-theme/static/img/win98-icons/key_win_alt-2.png" width="64" height="64">
          </div>
          <div class="d-flex flex-column">
            <p>
              Type a user name and password to log on to UIUCTF 2023.
            </p>
            <div class="row">
              <div class="col-4">
                {{ form.name.label(class="form-label") }}
              </div>
              <div class="col-8">
                {{ form.name(class="form-control", value=name) }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                {{ form.password.label(class="form-label") }}
              </div>
              <div class="col-8">
                {{ form.password(class="form-control", value=password) }}
              </div>
            </div>
            <div>
              <a class="font-xsmall" href="{{ url_for('auth.reset_password') }}">
                Forgot your password?
              </a>
            </div>
          </div>
          <div class="d-flex flex-column pl-4">
            <!-- {{ form.submit(class="btn btn-sm btn-primary") }} -->
            <button class="btn btn-sm btn-block btn-primary" id="_submit" name="_submit" value="Submit">
              <span>OK</span>
            </button>
            <button class="btn btn-sm btn-block btn-primary" disabled>
              <span>Cancel</span>
            </button>
          </div>
        </div>
        {{ form.nonce() }}
      </form>
      {% endwith %}
    `;
    this.createPane({
      name: "login",
      title: "Welcome to UIUCTF 2023",
      taskbar_title: "Log In",
      initial_body_elem: elem,
      icon_path: "/themes/uiuctf-2023-ctfd-theme/static/img/win98-icons/key_win-1.png",
      hide_minimize: true,
      hide_maximize: true,
      hide_close: false,
      disable_resize: true,
      transform: "center",
    });
  }

  createChallengesPane() {
    const elem = `
      <div class="bg-white h-100 w-100">
      </div>
    `;
    this.createPane({
      name: "challenges",
      title: "Challenges",
      taskbar_title: "Challenges",
      initial_body_elem: elem,
      icon_path:
        "/themes/uiuctf-2023-ctfd-theme/static/img/win98-icons/directory_open_file_mydocs_small-1.png",
      width: "600px",
      height: "400px",
    });
  }
}

Alpine.start();
