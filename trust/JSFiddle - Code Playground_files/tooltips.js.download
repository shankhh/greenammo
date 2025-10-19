let setContent = function(instance, event){
  instance.setContent(function(){
    // source element is different if triggered from a singleton or just an instance
    const sourceElement = event ? event.srcElement : instance.reference
    const dataset  = sourceElement.dataset
    const content  = dataset.tippySimpleContent || dataset.tippySpecialContent || dataset.tippyInputContent
    const proBadge = dataset.tippyPro === "" ? "<kbd class='pro'>Pro</kbd>" : ""
    const shortcut = dataset.tippyShortcut !== undefined ? `<kbd class='sc'>${dataset.tippyShortcut}</kbd>` : ""
    const extension = dataset.extension !== undefined ? document.getElementById("dropdown-set-expiration").innerHTML : ""
    return `<p>${content}</p> ${proBadge} ${shortcut}${extension}`
  })
}

tippyModule.createSingleton(tippy("header *[data-tippy-simple-content]"), {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  overrides: ["interactive"],
  appendTo: () => document.body,
  onTrigger: setContent,
  // trigger: "click",
})

Layout.element.tooltips.aiTitleSuggestion = tippy("header *[data-tippy-special-content]", {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  overrides: ["interactive"],
  appendTo: () => document.body,
  trigger: "manual",
  onShow: setContent
})

Layout.element.tooltips.sidebarMain = tippyModule.createSingleton(tippy("#sidebar-main h3[data-tippy-simple-content]"), {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  appendTo: () => document.body,
  onTrigger: setContent,
  placement: "right"
})
Layout.element.tooltips.sidebarMain.disable()

tippyModule.createSingleton(tippy("#sidebar-user *[data-tippy-simple-content]"), {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  appendTo: () => document.body,
  onTrigger: setContent
})

// tippy.createSingleton(tippy(".windowLabelCont *[data-tippy-simple-content]"), {
//   offset: [0, -4],
//   delay: [50, 500],
//   duration: [30, 200],
//   animation: "scale-subtle",
//   allowHTML: true,
//   theme: "light",
//   appendTo: () => document.body,
//   onTrigger: setContent
// })

tippyModule.delegate('#editor', {
  target: ".windowLabelCont *[data-tippy-simple-content]",
  offset: [0, -4],
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  appendTo: () => document.body,
  onTrigger: setContent
})

tippy("#switch-grid", {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  appendTo: () => document.body,
  trigger: "click",
  interactive: true,
  content: document.getElementById("dropdown-switch-grid")
})

tippy("#switch-theme", {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  appendTo: () => document.body,
  trigger: "click",
  interactive: true,
  content: document.getElementById("dropdown-switch-theme")
})

tippy("#set-expiration", {
  delay: [50, 500],
  duration: [30, 200],
  animation: "scale-subtle",
  allowHTML: true,
  theme: "light",
  appendTo: () => document.body,
  trigger: "click",
  interactive: true,
  content: document.getElementById("dropdown-set-expiration")
})

// REFACTOR: Pretty icky I know
for (const disabledEventElement of document.querySelectorAll("#switch-grid, #switch-theme")){
  disabledEventElement.addEventListener("click", (event) => {
    event.preventDefault()
  })
}