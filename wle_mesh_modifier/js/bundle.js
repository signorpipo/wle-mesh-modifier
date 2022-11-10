//WLE

require('@wonderlandengine/components/8thwall-camera');
require('@wonderlandengine/components/cursor-target');
require('@wonderlandengine/components/cursor');
require('@wonderlandengine/components/debug-object');
require('@wonderlandengine/components/device-orientation-look');
require('@wonderlandengine/components/finger-cursor');
require('@wonderlandengine/components/fixed-foveation');
require('@wonderlandengine/components/hand-tracking');
require('@wonderlandengine/components/hit-test-location');
require('@wonderlandengine/components/howler-audio-listener');
require('@wonderlandengine/components/howler-audio-source');
require('@wonderlandengine/components/image-texture');
require('@wonderlandengine/components/mouse-look');
//require('@wonderlandengine/components/player-height');
require('@wonderlandengine/components/target-framerate');
require('@wonderlandengine/components/teleport');
require('@wonderlandengine/components/two-joint-ik-solver');
require('@wonderlandengine/components/video-texture');
require('@wonderlandengine/components/vr-mode-active-switch');
require('@wonderlandengine/components/wasd-controls');
require('@wonderlandengine/components/wonderleap-ad');

//PP

require('./pp/pp');

//	PLUGIN
require('./pp/plugin/component_mods/clone_component_mod');
require('./pp/plugin/component_mods/cursor_component_mod');
require('./pp/plugin/component_mods/cursor_target_component_mod');
require('./pp/plugin/component_mods/mouse_look_component_mod');

require('./pp/plugin/extensions/array_extension');
require('./pp/plugin/extensions/object_extension');
require('./pp/plugin/extensions/math_extension');

//	AUDIO
require('./pp/audio/spatial_audio_listener');
require('./pp/audio/audio_manager_component');
require('./pp/audio/audio_manager');
require('./pp/audio/audio_player');
require('./pp/audio/audio_setup');
require('./pp/audio/mute_everything');

//	CAULDRON
require('./pp/cauldron/benchmarks/max_physx');
require('./pp/cauldron/benchmarks/max_visible_triangles');

require('./pp/cauldron/cauldron/number_over_value');
require('./pp/cauldron/cauldron/object_pool_manager');
require('./pp/cauldron/cauldron/physx_collision_collector');
require('./pp/cauldron/cauldron/save_manager');
require('./pp/cauldron/cauldron/timer');

require('./pp/cauldron/components/clear_console_on_xr_session_start');
require('./pp/cauldron/components/set_active');
require('./pp/cauldron/components/adjust_hierarchy_physx_scale');
require('./pp/cauldron/components/get_player_objects');
require('./pp/cauldron/components/get_default_resources');
require('./pp/cauldron/components/show_fps');

require('./pp/cauldron/fsm/fsm');
require('./pp/cauldron/fsm/state');
require('./pp/cauldron/fsm/transition');
require('./pp/cauldron/fsm/states/timer_state');

require('./pp/cauldron/utils/ca_utils');
require('./pp/cauldron/utils/color_utils');
require('./pp/cauldron/utils/mesh_utils');
require('./pp/cauldron/utils/save_utils');
require('./pp/cauldron/utils/text_utils');
require('./pp/cauldron/utils/xr_utils');

require('./pp/cauldron/physics/physics_utils');
require('./pp/cauldron/physics/physics_raycast_data');
require('./pp/cauldron/physics/physics_layer_flags');

require('./pp/cauldron/visual/visual_manager');

require('./pp/cauldron/visual/elements/visual_element_types');
require('./pp/cauldron/visual/elements/visual_line');
require('./pp/cauldron/visual/elements/visual_mesh');
require('./pp/cauldron/visual/elements/visual_point');
require('./pp/cauldron/visual/elements/visual_arrow');
require('./pp/cauldron/visual/elements/visual_text');
require('./pp/cauldron/visual/elements/visual_transform');
require('./pp/cauldron/visual/elements/visual_raycast');
require('./pp/cauldron/visual/elements/visual_torus');

require('./pp/cauldron/visual/components/visual_manager_component');

//	DEBUG
require('./pp/debug/debug_manager');
require('./pp/debug/debug_visual_manager');

require('./pp/debug/components/debug_transform_component');
require('./pp/debug/components/debug_manager_component');

//	GAMEPLAY
require('./pp/gameplay/cauldron/direction_2D_to_3D_converter');

require('./pp/gameplay/grab_throw/grabbable');
require('./pp/gameplay/grab_throw/grabber_hand');

//	INPUT
require('./pp/input/cauldron/finger_cursor');
require('./pp/input/cauldron/input_types');
require('./pp/input/cauldron/input_utils');
require('./pp/input/cauldron/keyboard');
require('./pp/input/cauldron/mouse');
require('./pp/input/cauldron/input_manager');
require('./pp/input/cauldron/input_manager_component');
require('./pp/input/cauldron/switch_hand_object');
require('./pp/input/cauldron/tracked_hand_draw_joint');
require('./pp/input/cauldron/tracked_hand_draw_all_joints');
require('./pp/input/cauldron/tracked_hand_draw_skin');

require('./pp/input/gamepad/gamepad_buttons');
require('./pp/input/gamepad/base_gamepad');
require('./pp/input/gamepad/universal_gamepad');
require('./pp/input/gamepad/gamepad_cores/gamepad_core');
require('./pp/input/gamepad/gamepad_cores/xr_gamepad_core');
require('./pp/input/gamepad/gamepad_cores/keyboard_gamepad_core');
require('./pp/input/gamepad/cauldron/gamepad_mesh_animator');
require('./pp/input/gamepad/cauldron/gamepad_manager');
require('./pp/input/gamepad/cauldron/gamepad_utils');
require('./pp/input/gamepad/cauldron/gamepad_control_scheme');

require('./pp/input/pose/base_pose.js');
require('./pp/input/pose/hand_pose');
require('./pp/input/pose/head_pose');
require('./pp/input/pose/tracked_hand_joint_pose');
require('./pp/input/pose/tracked_hand_pose');
require('./pp/input/pose/components/set_player_height');
require('./pp/input/pose/components/set_hand_local_transform');
require('./pp/input/pose/components/set_head_local_transform');
require('./pp/input/pose/components/set_vr_head_local_transform');
require('./pp/input/pose/components/set_non_vr_head_local_transform');
require('./pp/input/pose/components/set_tracked_hand_joint_local_transform');
require('./pp/input/pose/components/copy_hand_transform');
require('./pp/input/pose/components/copy_head_transform');
require('./pp/input/pose/components/copy_player_transform');
require('./pp/input/pose/components/copy_player_pivot_transform');

//	TOOL
require('./pp/tool/cauldron/cauldron/tool_types');
require('./pp/tool/cauldron/components/tool_cursor');

require('./pp/tool/console_vr/console_vr_widget_setup');
require('./pp/tool/console_vr/console_vr_widget_ui');
require('./pp/tool/console_vr/console_vr_widget');
require('./pp/tool/console_vr/console_vr');

require('./pp/tool/easy_tune/easy_object_tuners/easy_object_tuner');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_attenuation');
require('./pp/tool/easy_tune/easy_object_tuners/easy_light_color');
require('./pp/tool/easy_tune/easy_object_tuners/easy_mesh_color');
require('./pp/tool/easy_tune/easy_object_tuners/easy_scale');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_child_number');
require('./pp/tool/easy_tune/easy_object_tuners/easy_set_tune_target_grab');
require('./pp/tool/easy_tune/easy_object_tuners/easy_transform');

require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_array_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_bool_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_none_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_array_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_number_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget_ui');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_transform_widget_setup');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget');
require('./pp/tool/easy_tune/easy_tune_widgets/easy_tune_widget_setup');

require('./pp/tool/easy_tune/easy_tune_variables');
require('./pp/tool/easy_tune/easy_tune');

require('./pp/tool/widget_frame/widget_frame_setup');
require('./pp/tool/widget_frame/widget_frame_ui');
require('./pp/tool/widget_frame/widget_frame');

//MESH MODIFIER
require('./mesh_modifier/cauldron_utils');
require('./mesh_modifier/file_manager');
require('./mesh_modifier/vertex_group_config');
require('./mesh_modifier/direction_2D_to_3D_converter');
require('./mesh_modifier/locomotion');
require('./mesh_modifier/vertex_utils');
require('./mesh_modifier/selected_vertex_params');

require('./mesh_modifier/test/test_download');
require('./mesh_modifier/test/test_loadFile');
require('./mesh_modifier/test/test_set_axis');
require('./mesh_modifier/test/log_object');

require('./mesh_modifier/tool/tool_type');
require('./mesh_modifier/tool/tool_manager');
require('./mesh_modifier/tool/vertex/vertex_tool');
require('./mesh_modifier/tool/vertex/vertex_manage_groups_variants_tool');
require('./mesh_modifier/tool/vertex/vertex_free_edit_tool');
require('./mesh_modifier/tool/vertex/vertex_manage_groups_tool');
require('./mesh_modifier/tool/vertex/vertex_manage_variants_tool');
require('./mesh_modifier/tool/vertex/vertex_edit_variant_tool');
require('./mesh_modifier/tool/index/index_tool');
require('./mesh_modifier/tool/index/index_free_edit_tool');
require('./mesh_modifier/tool/dummy_tool');

require('./mesh_modifier/load_variants_component');
require('./mesh_modifier/load_variants');
require('./mesh_modifier/mesh_modifier_gateway');