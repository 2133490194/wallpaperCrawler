# 壁纸爬虫 v1.1.0

### 1.概述：

> 自动爬取壁纸并定时发送至你的邮箱。  
> 运行环境：nodejs  
> 已支持后台定时运行！

### 2.如何使用：

> 1.cd 到项目目录执行命令`npm install`  
> 2.在项目根目录下新建名称为.env 的文件  
> 3.打开.env 文件进行如下配置

### 3.如何配置：

> 你需要在.env 文件中以键值对的形式编写配置；  
> 例如：
>
> ```
> SENDER_EMAIL=xxxxxxx@qq.com
> SENDER_PASS=123456789abcd
> SENDER_HOST=smtp.qq.com
> SENDER_NAME=通知
> RECIPIENT_EMAIL=xxxxxxx@163.com
> EMAIL_SUBJECT=今日壁纸抓取结果
> RECURRENCE_RULE=0 0 9 * * *
> RESOLUTION=1920x1080
> RATIOS=9x16
> NSFW=on
> WALLPAPER_COUNT=30
> ```

### 4.配置属性说明：

> SENDER_EMAIL：发送方邮件地址（若不配置发送方邮件或发送方邮件授权码，则不会发送邮件，文件将保存至本地，可通过配置 DIR_PATH 属性，来决定文件存放位置，若两项都配，则开启发送邮件模式，文件不会保存至本地，文件可在邮件内的下载链接进行下载。）
>
> SENDER_PASS：发送方邮件授权码，即 IMAP/SMTP 服务授权码，需登录至邮箱官网自行开启该服务，开启后自动生成该密码。
>
> SENDER_HOST：发送邮件服务器；qq 邮箱为 smtp.qq.com；163 邮箱为 smtp.163.com
>
> SENDER_NAME：发送者名称
>
> RECIPIENT_EMAIL：接收方邮件地址
>
> EMAIL_SUBJECT=：邮件标题
>
> RECURRENCE_RULE：定时任务规则
>
> NSFW：绅士模式，` on `(开启) || ` off `(关闭)，随机爬取的过程中，概率爬到你可能想看到的图片（懂？）
>
> RESOLUTION：分辨率（格式：1920x1080），也可指定多个分辨率，多个分辨率用','隔开；例如：1920x1080,2560x1440 该表达式表示 1920x1080 和 2560x1440 这两种分辨率的图片都抓取
>
> RATIOS：比例（格式：16x9 16x10 21x9 32x9 48x9 9x16 10x16 9x18 1x1 3x2 4x3 5x4）；和分辨率一样可配置多个，用','，例如：16x9,1x1 表示这两种比例格式都抓取；隔开比例和分辨率二选其一即可，若都配，则两项都生效，若都不配，则包含所有分辨率和比例
>
> WALLPAPER_COUNT：爬取图片的数量，不配则默认为 24 张

### 5.直接运行一次：

> 在项目根目录下执行 `npm run start` 该命令将会将配置文件读取并直接运行一次爬虫任务，执行完毕后退出程序

### 6.后台定时运行：

> 1. 在项目根目录下执行命令：`npm run serve`；将会按照配置中定时任务规则在后台保持进程，定时执行。注意该模式必须配置`RECURRENCE_RULE` 此配置项，否则将会退出程序。
> 2. 查看运行日志：`npm run log`
> 3. 查看进程状态：`npm run status`
> 4. 停止进程：`npm run stop`
> 5. 重启该进程： `npm run restart`

### 7.运行规则：

> 1. 若不配置 SENDER_EMAIL 或 SENDER_PASS，将会进入本地存储模式，图片文件将会存储至项目目录下 src/imgData 文件夹下。
> 2. 若配置以上两项，则会进入邮件模式，文件不会保存至本地，将直接以 HTML 形式发送至接收方邮件地址。

### 8.如何配置定时任务规则：

> 该项目使用的是 Cron 风格的定时器：

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

> 6 个占位符分别表示 ：秒 分 时 日 月 周几
>
> `*` 表示通配符，匹配该域的任意值，假如在 Minutes 域使用 \* 表示每分钟都会触发事件
>
> `?` 字符仅被用于天（月）和天（星期）两个子表达式，表示不指定值，当 2 个子表达式其中之一被指定了值以后，为了避免冲突，需要将另一个子表达式的值设为' ? '
>
> `-` 表示范围，例如 在 Minutes 域使用 5-20，表示从 5 分到 20 分钟每分钟触发一次
>
> `/` 表示起始时间开始触发，然后每隔固定时间触发一次，如在 Minutes 域使用 5/20 表示第 5 分钟触发一次，随后每隔 20 分钟出发一次，也就是在 25 分、45 分各触发一次。
>
> `,` 表示枚举值，如在 Minutes 域使用 5, 20，表示在 5 和 20 分各触发一次

> 下面是一些简单的示例：
>
> 每分钟的第 30 秒触发： '30 \* \* \* \* \*'
>
> 每小时的 1 分 30 秒触发 ：'30 1 \* \* \* \*'
>
> 每天的凌晨 1 点 1 分 30 秒触发 ：'30 1 1 \* \* \*'
>
> 每月的 1 日 1 点 1 分 30 秒触发 ：'30 1 1 1 \* \*'
>
> 2016 年的 1 月 1 日 1 点 1 分 30 秒触发 ：'30 1 1 1 2016 \*'
>
> 每周 1 的 1 点 1 分 30 秒触发 ：'30 1 1 \* \* 1'

### 9.执行日志

> 执行过程中日志将自动保存至 src/logs 文件夹中，日志文件名加入时间戳每天写入单独的文件，以供后台运行时方便查看当天打印的日志信息

### 10.更新日志

> #### v1.1.0：
>
> 1. 同步存储已修改为为异步多线程存储，为避免写入失败，调整为 5 个线程写入文件，提升了总体存储速度
> 2. 支持后台执行定时任务脚本，提供多个后台执行可操作的指令
> 3. 可配置抓取壁纸数量
> 4. 绅士模式可开关
> 5. 分辨率与比例支持配置多个；以','分隔：1x1,9x16,9x18
> 6. 去除 DIR_PATH 配置项，文件固定存储至 src/imgData 目录下
> 7. 优化部分代码
>
> （ 版本更新于：2021/12/4 ）

### 11.关于

> 壁纸来源：https://wallhaven.cc/
