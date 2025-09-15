/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const _0x1cd41d = _0x2802;
(function (_0x45b608, _0x2770ed) {
  const _0x3a087d = _0x2802,
    _0x5c24ee = _0x45b608();
  while (!![]) {
    try {
      const _0x3ae8ab =
        -parseInt(_0x3a087d(0x192)) / 0x1 +
        (-parseInt(_0x3a087d(0x18d)) / 0x2) *
          (-parseInt(_0x3a087d(0x18c)) / 0x3) +
        -parseInt(_0x3a087d(0x187)) / 0x4 +
        parseInt(_0x3a087d(0x18b)) / 0x5 +
        -parseInt(_0x3a087d(0x186)) / 0x6 +
        -parseInt(_0x3a087d(0x195)) / 0x7 +
        parseInt(_0x3a087d(0x194)) / 0x8;
      if (_0x3ae8ab === _0x2770ed) break;
      else _0x5c24ee["push"](_0x5c24ee["shift"]());
    } catch (_0x3613e1) {
      _0x5c24ee["push"](_0x5c24ee["shift"]());
    }
  }
})(_0x5c8c, 0xa82ed);
function _0x2802(_0x4cca84, _0x9f4f67) {
  const _0x5c8c71 = _0x5c8c();
  return (
    (_0x2802 = function (_0x2802ee, _0x32d103) {
      _0x2802ee = _0x2802ee - 0x185;
      let _0x598d0b = _0x5c8c71[_0x2802ee];
      return _0x598d0b;
    }),
    _0x2802(_0x4cca84, _0x9f4f67)
  );
}
const axios = require(_0x1cd41d(0x189));
async function validateLicense() {
  const _0x2fd968 = _0x1cd41d;
  try {
    const _0x56f1be = await axios["post"](_0x2fd968(0x193), {
      licenseKey: process[_0x2fd968(0x188)][_0x2fd968(0x196)],
    });
    if (!_0x56f1be[_0x2fd968(0x190)][_0x2fd968(0x18e)])
      throw new Error(_0x56f1be[_0x2fd968(0x190)][_0x2fd968(0x18f)]);
    console[_0x2fd968(0x197)](
      "✅\x20License\x20check\x20passed\x20for:",
      _0x56f1be["data"]["client"]
    );
  } catch (_0x365c32) {
    console[_0x2fd968(0x18a)](_0x2fd968(0x191), _0x365c32["message"]),
      process[_0x2fd968(0x185)](0x1);
  }
}
function _0x5c8c() {
  const _0x547e0f = [
    "error",
    "1884865qSoOiX",
    "90792mvARZS",
    "6MKxVQi",
    "valid",
    "message",
    "data",
    "❌\x20License\x20validation\x20failed:",
    "1279769JkKHvJ",
    "https://jgdev-license-server.onrender.com/validate",
    "32146016ftvTAS",
    "4604887TOFlJL",
    "LICENSE_KEY",
    "log",
    "exit",
    "4484934FKnUvj",
    "4448164WxrxZx",
    "env",
    "axios",
  ];
  _0x5c8c = function () {
    return _0x547e0f;
  };
  return _0x5c8c();
}
module["exports"] = { validateLicense: validateLicense };
