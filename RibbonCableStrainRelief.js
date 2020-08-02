/*

View this file at:
https://openjscad.org/#https://raw.githubusercontent.com/JamesNewton/CAD/master/RibbonCableStrainRelief.js


Basic strain relief shape for ribbon cable over a terminal block or other connector. 
If there is room, this allows the cable to be secured by simply epoxying this over the top and down the sides. 
The biggest problem with this is that the side sections with interfere with anything to the side. 
And it does require superglue or epoxy to attach this part to the connector. 



*/
  

const inch = 25.4;
const spread = 0.005*inch //filamnet spread, adjust for your printer.
const wide = 0.803*inch + spread*2//width of terminal block
const d = 0.3*inch //depth of strain relief block. 
const wiredia = 0.05*inch
const wirew = wiredia * 10 + spread * 2//multiply wire diameter by number of conductors in cable
const sideh = 0.25*inch //how far to go down the side of the terminal block
const sidew = 0.1*inch //thickness of side overhang
const over = 0.3*inch //
const h = wiredia + sideh + over
const w = wide + sidew

  function main() { 
      return union(
          layout()
          //,axis()
          )
      //return 
    }

function layout() {
    return difference(
            union( 
                cube([w,d,h])
                )
            ,cube([wide, d, h])
                .translate([sidew/2,0,-over])
            ,cube([wirew, d, wiredia])
                .translate([(w-wirew)/2,0,over-(spread*2)-(wiredia/8)])
            ).rotateX(90) //lay down for printing
        
}

function cutout(h, toplip, botlip, w, d){
    var hh = h-botlip
    var path = new CSG.Path2D([ 
        [-botlip,d+bot]
        , [-(h-toplip),d+bot]
        , [-h/2,indent] 
        , [-botlip,indent]
        ]
        //, [-(h-toplip),indent]
        , /* closed = */ true
        );
    var area = path.innerToCAG()
    var shape = linear_extrude({ height: w },area)
    return shape.rotateY(90)
}
    
function holes(num,space,dia) {
    let o = []
    for (let i = 0; i<num; i++) {
        o.push(cylinder({r: dia, h: h}).translate([i*space+dia,0,0]))
    }
    return union(o)
}

function text(msg, size) {
    var l = vectorText({input:msg, height:size});   // l contains a list of polylines to be drawn
    var o = [];
    l.forEach(function(pl) {                   // pl = polyline (not closed)
       o.push(rectangular_extrude(pl, {w: size/10, h: size/10}));   // extrude it to 3D
    });
    return union(o);
    }

function axis() {
    let unit = 1*inch
    return union (
    color("red",cube([unit,.1,.1],{center:true})), 
    text("X", 1).rotateZ(90).translate([unit+2,-.7,0]),
    color("red",cube([.1,unit,.1],{center:true})), 
    text("Y", 1).translate([-.5,unit+1,0]),
    color("red",cube([.1,.1,unit],{center:true})), 
    text("Z", 1).rotateX(90).translate([-.5,0,unit+1])
    ,color("red",cube({center:true}))
    )
}



/*
                ,cylinder({r:(h-botlip-toplip), h: w, fn:3})
                    //.rotateX(-90)
                    .rotateY(90)
                    .translate([indent,0,(h-botlip-toplip)])
                    */
