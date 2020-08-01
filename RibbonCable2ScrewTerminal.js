/*
Ribbon cables are great for high speed data signals IF you put ground wires between every signal wire.
They are /collectivly/ strong and capable. Individually, each wire is thin and easy to break. 
Interfacing ribbon cables to headers via IDC plugs is easy and reliable. However, interfacing
ribbon cables to screw terminals or other single pin systems without strain relief is... bad.
The individual wires can break if pulled, and will flex badly in the opening of the screw clamp. 
This is an attempt to make a thing that holds the ribbon cable pins securely in place while
exposing every other conductor as a single pin. The pin is provided by a single 90' RA or "right angle"
header pin, removed from the header, and inserted into the small hole, from inside the thing. 
The effect is to have a pin sticking out horizontally from inside the thing, held by the roof,
just under and behind the ribbon cable slot. Cable wires then enter from the top, and the signal
wires are stripped and soldered to the "knee" of the pin. Ground wires are soldered together. 

*/
  

const inch = 25.4;
const w = 0.75*inch
const d = 0.5*inch
const h = 0.6*inch
const bot = 0.15*inch
const botlip = 0.1*inch
const toplip = 0.00*inch
const indent = 0.22*inch
const pindia = 0.025*inch
const wiredia = 0.06*inch
const cablelen = 0.52*inch

  function main() { 
      return layout()
      //return 
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
    return union (
    color("red",cube([40,.1,.1],{center:true})), 
    text("X", 1).rotateZ(90).translate([42,-.7,0]),
    color("red",cube([.1,40,.1],{center:true})), 
    text("Y", 1).translate([-.5,41,0]),
    color("red",cube([.1,.1,40],{center:true})), 
    text("Z", 1).rotateX(90).translate([-.5,0,41])
    ,color("red",cube({center:true}))
    )
}

function layout() {
    return difference(
            union( //axis(),
                cube([w,d+bot,h])
                )
            ,cutout(h, toplip, botlip, w,d)
            //,cube([w,indent,h-botlip-toplip])
            //    .translate([0,indent,botlip])
            ,cube([w,d,h]).rotateX(-3).translate([0,d-1,botlip+1])
            //,holes(8,0.1*inch,pindia).translate([0,d-indent+pindia,h-toplip])
            ,holes(4,0.2*inch,pindia)
                .translate([0.05*inch,indent+pindia,botlip])
            //,holes(4,0.2*inch,wiredia).translate([wiredia/2,d-indent/2,h-toplip])
            ,cube([cablelen, wiredia, h])
                .translate([(w-cablelen)/2,indent+pindia*4,botlip])
            )
        
}


/*
                ,cylinder({r:(h-botlip-toplip), h: w, fn:3})
                    //.rotateX(-90)
                    .rotateY(90)
                    .translate([indent,0,(h-botlip-toplip)])
                    */
