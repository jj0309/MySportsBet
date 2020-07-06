window.addEventListener("load",()=>{
    fadeForEach(document.querySelectorAll(".gameReference"));
});

const fadeForEach=(NodeContainer)=>{
    NodeContainer.forEach(element => {
        fadeInEffect(element);
    });
};

const fadeInEffect=(node)=>{
    let opacitiy=0
    setInterval(()=>{
        if(opacitiy<1)
            node.style.opacity=(opacitiy+=0.1)+"";
    },50);
};