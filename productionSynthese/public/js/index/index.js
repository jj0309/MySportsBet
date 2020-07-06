window.addEventListener("load",()=>{
    const numberOfIndex = 3; // number of images
    const headerTextValue = "Placer vos mises AUJOURD'HUI"; // the header at the front
    let indexContainerNode = document.querySelector("#gameIndexContainer");
    let headerNode = document.createElement("h1");
    let textNode = document.createTextNode(headerTextValue);

    styleHeader(headerNode,textNode,indexContainerNode);
    showBanners(numberOfIndex,indexContainerNode);


    fadeForEach(document.querySelectorAll(".gameIndex"));
    fadeForEach(document.querySelectorAll(".gameReference"));
})

const opacityZero=(arr)=>{
    arr.forEach(element => {
        element.style.opacitiy="0";
    });
}

const fadeForEach=(NodeContainer)=>{
    NodeContainer.forEach(element => {
        fadeInEffect(element);
    });
}

const fadeInEffect=(node)=>{
    let opacitiy=0
    setInterval(()=>{
        if(opacitiy<1)
            node.style.opacity=(opacitiy+=0.1)+"";
    },50)
}

const styleHeader=(headerNode,textNode,indexContainerNode)=>{
    // styling of the header
    headerNode.appendChild(textNode);
    headerNode.style.color = "white";
    headerNode.style.textAlign = "center";
    headerNode.style.gridColumn = "1/4";
    headerNode.style.paddingTop = "0.5em";
    headerNode.style.fontFamily = 'Oxanium';
    indexContainerNode.appendChild(headerNode);
}

/* 
    appends the 3 sport choices (big images) into gameIndexContainer
    ***---> image order: 1:hockey 2:basketball 3:baseball <---******
    *********************************************************
    ***** important to follow the order above or else ********
    *********** it will have the wrong image *****************
    ************** for the assigned sport *********************
*/
const showBanners=(numberOfIndex,indexContainerNode)=>{
    for(let index = 0;index<numberOfIndex;index++)
    {
        let newGameIndex = document.createElement("a");
        let gridValue = "";
        let refer = "";
        newGameIndex.className = "gameIndex";
        newGameIndex.style.backgroundImage = "url(/public/images/indexImages/"+index+".jpg)";
        newGameIndex.style.backgroundPosition = "center";
        newGameIndex.style.backgroundSize = "100% 100%";
        newGameIndex.style.borderRadius = "25px";
        newGameIndex.style.opacity="0";
        // assigns the grid position and  the href depending on which one it is
        switch (index) {
            case 0:
                gridValue="1/2"
                refer = "/schedule"
                break;
            case 1:
                gridValue="2/3"
                refer = "/schedule"
                break;
            case 2:
                gridValue="3/4"
                refer = "/schedule"
                break;
        }
        newGameIndex.style.gridColumn = gridValue;
        newGameIndex.href=refer;
        indexContainerNode.appendChild(newGameIndex);
    }
}