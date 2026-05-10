// Bike & thief pixel sprites — inline SVG so colors can be swapped via props
const Sprites = {

  // 52x32 — side-view bicycle drawn from frame primitives
  Bike: ({scale = 3, colors = {ink:'#081820', mid:'#346856', hi:'#88c070'}}) => {
    const px = scale;
    // pixel grid (rows of strings; '.' = empty, K = ink, M = mid, H = hi)
    const grid = [
      "....................................................",
      "....................................................",
      "....................................................",
      "....................................................",
      "....................................................",
      "....................................................",
      "..................KKK...............................",
      ".................KKKKK........KKKKK.................",
      "....................KKKKKKKKKKKKK..K................",
      "...................KK........K..KK.K................",
      "...................K.K.........K.K..................",
      "..................K..K.........K..K.................",
      ".................K....K.......K....K................",
      "................K.....K.......K.....K...............",
      "................K......K.....K......K...............",
      "..........K....K.......K.....K.......K....K.........",
      "........KKKKK.K........K.....K........K.KKKKK.......",
      "......KK..K..KK.........K...K.........KK..K..KK.....",
      ".....K....K..K.K........K...K........K.K..K....K....",
      ".....K....K.K..K.........K.K.........K..K.K....K....",
      "....K.....KK....K........K.K........K....KK.....K...",
      "....K.....KK....K.........K.........K....KK.....K...",
      "...KKKKKKKKKKKKKKKKKKKKKKKKK.......KKKKKKKKKKKKKKK..",
      "....K.....K.....K......K..K.........K.....K.....K...",
      "....K.....K.....K....KK.............K.....K.....K...",
      ".....K....K....K.....K...............K....K....K....",
      ".....K....K....K.....................K....K....K....",
      "......KK..K..KK.......................KK..K..KK.....",
      "........KKKKK...........................KKKKK.......",
      "..........K...............................K.........",
      "....................................................",
      "....................................................",
    ];
    const W = grid[0].length, H = grid.length;
    const rects = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (c === 'K') rects.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={colors.ink}/>);
      else if (c === 'M') rects.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={colors.mid}/>);
      else if (c === 'H') rects.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={colors.hi}/>);
    }
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W*px} height={H*px} shapeRendering="crispEdges" style={{imageRendering:'pixelated'}}>
        {rects}
      </svg>
    );
  },

  // 24x32 — thief walking
  Thief: ({scale = 3, colors = {ink:'#081820', skin:'#e0f8d0', shirt:'#ff00aa'}}) => {
    const px = scale;
    const grid = [
      "........................",
      "........KKKKKK..........",
      ".......KKKKKKKK.........",
      ".......KSSSSKKK.........", // hat
      "......KSSSSSSKK.........",
      "......KKKKKKKKK.........", // band
      ".......K.KK.K...........", // face / mask
      ".......KSSSSK...........",
      ".......KSSSSK...........",
      "........KKKK............",
      "......TTTTTTTT..........", // shirt top
      ".....TTTTTTTTTT.........",
      "....TTTTTTTTTTTT........",
      "....TTKTTTTTTKTT........",
      "....TTKTTTTTTKTT........",
      "....TTKTTTTTTKTT........",
      ".....TTTTTTTTTT.........",
      ".....TTTTTTTTTT.........",
      "......KKKKKKKK..........",
      "......K..KK..K..........", // legs
      "......K..KK..K..........",
      "......K..KK..K..........",
      "......K..KK..K..........",
      "......KK.KK.KK..........",
      ".....KKK.KK.KKK.........",
      "....KKKK.KK.KKKK........", // shoes
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
    ];
    const W = grid[0].length, H = grid.length;
    const rects = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (c === 'K') rects.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={colors.ink}/>);
      else if (c === 'S') rects.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={colors.skin}/>);
      else if (c === 'T') rects.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={colors.shirt}/>);
    }
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W*px} height={H*px} shapeRendering="crispEdges" style={{imageRendering:'pixelated'}}>
        {rects}
      </svg>
    );
  },

  // Static scene background — sidewalk + bike rack
  Sidewalk: () => (
    <svg viewBox="0 0 200 80" width="100%" height="80" preserveAspectRatio="none" shapeRendering="crispEdges" style={{imageRendering:'pixelated', position:'absolute', bottom:0, left:0, right:0}}>
      {/* sidewalk */}
      <rect x="0" y="60" width="200" height="20" fill="#88c070"/>
      <rect x="0" y="58" width="200" height="2" fill="#346856"/>
      {/* sidewalk seams */}
      {[...Array(7)].map((_,i) => (
        <rect key={i} x={i*30+5} y="60" width="2" height="20" fill="#346856" opacity="0.5"/>
      ))}
      {/* far building */}
      <rect x="10" y="20" width="50" height="42" fill="#346856"/>
      <rect x="14" y="26" width="6" height="6" fill="#e0f8d0"/>
      <rect x="24" y="26" width="6" height="6" fill="#e0f8d0"/>
      <rect x="34" y="26" width="6" height="6" fill="#e0f8d0"/>
      <rect x="14" y="38" width="6" height="6" fill="#e0f8d0"/>
      <rect x="24" y="38" width="6" height="6" fill="#e0f8d0"/>
      <rect x="34" y="38" width="6" height="6" fill="#e0f8d0"/>
      <rect x="44" y="46" width="14" height="16" fill="#081820"/>
      {/* tree */}
      <rect x="170" y="40" width="3" height="22" fill="#346856"/>
      <rect x="166" y="22" width="11" height="20" fill="#346856"/>
      <rect x="164" y="28" width="15" height="10" fill="#346856"/>
      {/* bike rack */}
      <rect x="92" y="58" width="2" height="6" fill="#081820"/>
      <rect x="106" y="58" width="2" height="6" fill="#081820"/>
      <rect x="92" y="56" width="16" height="2" fill="#081820"/>
    </svg>
  ),
};

window.Sprites = Sprites;
