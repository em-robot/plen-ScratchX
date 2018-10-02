/// <reference path="plen-control-server.api.ts"/>


declare var ScratchExtensions: any;

((plen_extension: any) =>
{
    var server: PLENControlServerAPI = new PLENControlServerAPI($);

    // Cleanup function when the extension is unloaded.
    plen_extension._shutdown = () =>
    {
        server.disconnect();
    };

    // Status reporting code:
    // Use this to report missing hardware, plugin or unsupported browser.
    plen_extension._getStatus = () =>
    {
        var server_state: SERVER_STATE = server.getStatus();
        var status: number;
        var msg: string;

        switch (server_state)
        {
            case (SERVER_STATE.CONNECTED):
            {
                status = 2; msg = 'Connected';
                break;
            }

            case (SERVER_STATE.DISCONNECTED):
            {
                status = 0; msg = 'Disconnected';
                break;
            }

            default:
            {
                status = 1; msg = 'Waiting...';
            }
        }

        return { status: status, msg: msg };
    };

    // Definition of command blocks.
    plen_extension.connect = ()          => { server.connect(); };
    plen_extension.push    = (n: number) => { server.push(n);   };
    plen_extension.pop     = ()          => { server.pop();     };
    plen_extension.stop    = ()          => { server.stop();    };

    // Definition of reporter blocks.
    plen_extension.slot_forward    = () => { return 1;  };
    plen_extension.slot_left_turn  = () => { return 71; };
    plen_extension.slot_right_turn = () => { return 72; };
    plen_extension.slot_left_kick  = () => { return 23; };
    plen_extension.slot_right_kick = () => { return 25; };

    // Block and block menu descriptions.
    var descriptors: any = {
        'en': {
            blocks: [
                // [<BLOCK_TYPE>, <BLOCK_NAME>, <FUNCTION_NAME>, <DEFAULT_ARGUMENT>...]
                // s.a. https://github.com/LLK/scratchx/wiki#adding-blocks
                [' ', 'Connect',                 'connect'         ],
                [' ', 'Reserve to play slot %n', 'push',          0],
                [' ', 'Play all',                'pop'             ],
                [' ', 'Stop to play any motion', 'stop'            ],
                ['r', 'Slot: Step to forward',   'slot_forward'    ],
                ['r', 'Slot: Turn to left',      'slot_left_turn'  ],
                ['r', 'Slot: Turn to right',     'slot_right_turn' ],
                ['r', 'Slot: Left kick',         'slot_left_kick'  ],
                ['r', 'Slot: Right kick',        'slot_right_kick' ]
            ]
        },
        'ja': {
            blocks: [
                // [<BLOCK_TYPE>, <BLOCK_NAME>, <FUNCTION_NAME>, <DEFAULT_ARGUMENT>...]
                // s.a. https://github.com/LLK/scratchx/wiki#adding-blocks
                [' ', '接続 (せつぞく)',                         'connect'         ],
                [' ', 'モーション %n 番のプレイを予約 (よやく)', 'push',          0],
                [' ', 'モーションを全てプレイ',                  'pop'             ],
                [' ', 'モーションを停止',                        'stop'            ],
                ['r', '数字: 前進',                              'slot_forward'    ],
                ['r', '数字: 左を向く',                          'slot_left_turn'  ],
                ['r', '数字: 右を向く',                          'slot_right_turn' ],
                ['r', '数字: 左足でける',                        'slot_left_kick'  ],
                ['r', '数字: 右足でける',                        'slot_right_kick' ]
            ]
        }
    };

    var descriptor: any = descriptors[navigator.language];

    // Register the extension.
    ScratchExtensions.register('PLEN', (descriptor)? descriptor : descriptors['en'], plen_extension);
})({});
