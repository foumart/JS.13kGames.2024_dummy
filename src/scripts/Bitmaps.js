const unitWidth = 8;
const tileWidth = 6;
const offscreenBitmaps = [];

const offscreenPixelData = [
	// UNITS
	"ff2b00c926062a2a3f565662da8763ffb08effffff",// player
	"ff2b00c926062a2a3f565662da8763ffb08effffff",// player
	"864404452d15f77b00bf6812c6c6d4e3e3f1ffffff",// ship up
	"864404452d15f77b00bf6812c6c6d4e3e3f1ffffff",// ship down
	"864404452d15f77b00bf6812c6c6d4e3e3f1ffffff",// ship right
	"864404452d15f77b00bf6812c6c6d4e3e3f1ffffff",// ship left
	
	"24a22c39be4300e9120d8537982943c52e51544434",// enemy 1
	"2965ff2658d7537de73a3a933c6be24343a0544434",// enemy 2
	"24a22c39be4300e9120d8537982943c52e51544434",// enemy 1

	"864404f77b003338335c655f9d9da7d2d2e1ffffff",// castle
	"32323200ca100d85375a605b899589a9b9a9ffffff",// shrine
	"864404452d1512510d00ca1024a9210d853700e912",// tree
	"b25800dd8700e4ae1e31395ffff115ffca3ab3cdf0",// gold
	"adbaa8f4e5d50c680471806ba7734024a22c835426",// mount
	"adbaa8f4e5d50c680471806ba7734024a22c835426",//
	"adbaa8f4e5d50c680471806ba7734024a22c835426",//

	// TILES
	"3737d13a3adc3d3ddf4343de4d4de8",// 00 depths
	"3a3adc3d3ddf4343de4d4de8",// 01 water
	"4343de4d4de85c5cf07070ef",// 02 riff1
	"93791f2db22d3d963d4343de4d4de87070ef8585f5",// 04 riff3
	"3d3ddf4343de4d4de87070ef8585f5",// 04 riff2
	"4343de4d4de87070ef8585f5c8c8f5",// 05 shine
	"4d4de84343de8585f54343de00ae0000c70000dc00",
	"4d4de84343de8585f54343de00ae0000c70000dc00",
	"4d4de84343de8585f54343de00ae0000c70000dc00",
	"4d4de84343de8585f54343de00ae0000c70000dc00",

	"2db22d3d963d2bc82b32db32",// 00 land
	"2e8b2e2db22d3d963d2bc82b32db32ffb0693737d14343de",// 11 coasts
	"2e8b2e2db22d3d963d2bc82b32db32ffb0693737d14343de",// 12
	"2e8b2e2db22d3d963d2bc82b32db32ffb0693737d14343de",// 13
	"2db22d3d963d2bc82b32db32ffb0694343de7070ef",// 14
	"2db22d3d963d2bc82b32db32ffb0693737d14343de7070ef",// 15
	"2e8b2e2db22d3d963d32db32ffb0693737d14343de4d4de8",// 16
	"2e8b2e2db22d3d963d32db32ffb0693737d14343de4d4de8",// 17
	"2db22d3d963d2bc82b32db32ffb0693737d14343de7070ef",// 18
	"2db22d3d963d2bc82b32db32ffb0693737d14d4de87070ef",// 19
	"2db22d3d963d2bc82b32db32ffb0693737d14343de4d4de8",// 1A
	"2e8b2e2db22d3d963d32db32ffb0693737d14343de7070ef",// 1B
	"2db22d3d963d2bc82b32db32ffb0693737d14343de4d4de8",// 1C
	"2db22d3d963d2bc82b32db32ffb0697070ef4343de4d4de8",// 1D
	"2db22d3d963d2bc82b32db32ffb0693737d14343de7070ef",// 1E
	"00dc002db22d3d963d2bc82bffb0693737d14343de4d4de8"//  1F
];

const offscreenColorData = [
	// UNITS
	"Xb[DcIRc\\w{YPvMBXmRKfkZVX\\cC@[XC",// player
	"\`cZC\\RI\\K_~cPunBYmQCrkZtX\\cC@[XC",// player
	"@nc@pwt@x}Fpw|Gh~qE@PF@PacA@JL@",// ship up
	"@nc@pwt@x}Fpw|Gh~qE@PF@PacA@JL@",// ship down
	"hnc@}wD@n~}@}ulGpoAuEBB\\JccAPII@",// ship right
	"@\\uE@\`~o@owuxenonH}FcPPhH\\\\Q@IIB",// ship left
	
	"@QA@HZJAQLQLHMHbp@Qd@HbD@ad@\`d@@",// enemy1
	"HA@@ZJ@@lS@Ddm@fpdtD@vf@@\`D@@@@@",//enemy2
	"@QA@HZJAQLQLHMHbp@Qd@HbD@ad@\`d@@",// enemy1

	"psscpw]pOw]\`vn\\@ctCXc^|Q_euQ^l",//10 castle
	"@kf@pwwA{nn\\wLyfnIqMwI|flat]SCcB",//11 shrine
	"@fuCp}g]p|l^Xfu^@s^C@@B@@@A@@@@@",//12 tree
	"@PA@@jV@XVY@HZuA_uSg|ZzD\`g@@dD@",//13 gold
	"@QA@XRbCKUL[kai\\fotootots}e^X[XC",//14 mount
	"@QA@XRbCKUL[kai\\fotootots}e^X[XC",//15
	"@QA@XRbCKUL[kai\\fotootots}e^X[XC",//16

	// TILES
	"TlSbZL]IbTIkaSTZeb",// 00 depths
	"dKc[\\bK[Tb[YTc[\\Yd",// 01 water
	"RSQQRRRRTRQRSRQRRR",// 02 riff1
	"mgmuslmmmqmglurmmm",// 04 riff3
	"S[U[cc[[[kZZ\\L[S[S",// 03 riff2
	"RSRaRTlTSbQRSReRRd",// 05 shine
	"IRJZQK[SQZRRQJ[QR[",
	"IRJZQK[SQZRRQJ[QR[",
	"IRJZQK[SQZRRQJ[QR[",
	"IRJZQK[SQZRRQJ[QR[",

	"IKQIIIJaIIIYYQIIII",// 10 land
	"bRsRRqS]~RJbZqRRs",// 11 coasts
	"RRUjRRRbRRYbKvKvv",// 12 
	"NRU^RRwcR7QbNSS^RR",// 13
	"lwoYdKSIIIaQaIYJIL",// 14
	"\\~QYuIIjaIjIYiQIj",// ◱ 15
	"bRiRRkR\\iZJuIm~mv",// ◰ 16
	"MRR]bRMSbnYQwmKvm",// ◳ 17
	"whcnLIUISMLIUIaUYI",// ◲ 18
	"w\\nIUYjUIjMLUIi",// 19
	"m\\}IIjIKjQQujm~uv",// ] 1A 10
	"UTk Ri]bkMSunm~wv",// [ 1B 11
	"o\\mUaIUIYnRIwmUvn",// 1C 12
	"UYjMLuUIjnJkUIjMai",// ║ 1D 13
	"l\\lIIIaIYQjJjUun",// ═ 1E 14
	"nLuMRiUbj]Zunm~wv"// ⧈ 0F 15
];

for (let z,i,j,l,k = 0; k < offscreenPixelData.length; k++) {
	l = k < 16 ? unitWidth : tileWidth;
	const offscreenCanvas = document.createElement('canvas');
	offscreenCanvas.width = l;
	offscreenCanvas.height = l;
	const offscreenCtx = offscreenCanvas.getContext('2d');

	let offscreenC = offscreenPixelData[k];
	let offscreenpx = [];
	let offscreenD = offscreenColorData[k].replace(/./g,a=>{
		z = a.charCodeAt()
		offscreenpx.push(z&7)
		offscreenpx.push((z>>3)&7)
	});
	for(j = 0; j < l; j++) {
		for(i = 0; i < l; i++){
			if(offscreenpx[j*l+i]) {
				offscreenCtx.fillStyle = "#"+offscreenC.substr(6*(offscreenpx[j*l+i]-1), 6);
				offscreenCtx.fillRect(i, j, 1, 1);
			}
		}
	}

	offscreenBitmaps.push(offscreenCanvas);
}

