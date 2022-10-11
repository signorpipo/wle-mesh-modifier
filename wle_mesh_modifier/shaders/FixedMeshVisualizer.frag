#include "lib/Compatibility.frag"

#define USE_MATERIAL_ID
#define USE_BARYCENTRIC

#include "lib/Inputs.frag"
#include "lib/Materials.frag"

struct Material {
    lowp vec4 color;
    lowp vec4 wireframeColor;
};

Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}

void main() {
    Material mat = decodeMaterial(fragMaterialId);

    lowp vec3 d = fwidth(fragBarycentric);
    lowp vec3 factor = smoothstep(vec3(0.0), d*1.5, fragBarycentric);
    lowp float nearest = min(min(factor.x, factor.y), factor.z);
    lowp float fixedNearest = (1.0 - nearest) * 0.95;

    outColor = vec4(fragBarycentric.x,fragBarycentric.y,fragBarycentric.z, 1); 
    //outColor = mix(mat.wireframeColor, mat.color, fixedNearest);
}
