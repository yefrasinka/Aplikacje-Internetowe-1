const styles: { [key: string]: string } = {
    "Style 1": "css/page1.css",
    "Style 2": "css/page2.css",
    "Style 3": "css/page3.css"
};

let currentStyle: string = "Style 1";

function setStyle(styleName: string) {
    const styleLink = document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;

    if (styleLink) {
        styleLink.href = styles[styleName];
    }
    currentStyle = styleName;

    const buttons = document.querySelectorAll("#style-switcher button");
    buttons.forEach(button => {
        if (button.textContent === styleName) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

function createStyleButtons() {
    const container = document.getElementById("style-switcher");

    if (container) {
        Object.keys(styles).forEach(styleName => {
            const button = document.createElement("button");
            button.textContent = styleName;
            button.addEventListener("click", () => setStyle(styleName));
            container.appendChild(button);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createStyleButtons();
    setStyle(currentStyle);
});
