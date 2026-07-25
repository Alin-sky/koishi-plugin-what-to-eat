import { Context, Schema, Session } from 'koishi'
import { } from '@koishijs/plugin-http'
import * as fs from 'fs'
import * as path from 'path'

export const name = 'what-to-eat'
export const usage = '今天吃什么/喝什么 插件'

export interface Config {
  betaConfig?: boolean
  text?: string[]
}

export const Config: Schema<Config> = Schema.object({
  betaConfig: Schema.boolean().default(false),
  text: Schema.array(String).default([]),
})

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('what-to-eat')

  // 加载数据文件
  let foods: string[] = []
  let drinks: string[] = []
  try {
    const foodPath = path.join(ctx.baseDir, 'data/what-to-eat/food.json')
    const drinkPath = path.join(ctx.baseDir, 'data/what-to-eat/drink.json')
    if (fs.existsSync(foodPath)) foods = JSON.parse(fs.readFileSync(foodPath, 'utf-8')).foods
    if (fs.existsSync(drinkPath)) drinks = JSON.parse(fs.readFileSync(drinkPath, 'utf-8')).drinks
  } catch (e) {
    logger.warn('数据文件加载失败，请将 food.json 和 drink.json 放到 data/what-to-eat/ 目录下')
  }

  const sendMarkdown = async (session: Session, message: string) => {
    const channelId = session.channelId
    let appended = message
    if (config.betaConfig) {
      const openid = session.isDirect ? session.userId : session.guildId
      appended += `\n***\n> 您当前正在使用测试版本的AL_1S机器人\n> _测试ID：${openid}_`
    }

    const payload = {
      msg_type: 2,
      msg_id: session.messageId,
      markdown: { content: appended },
      keyboard: {
        content: {
          rows: [
            {
              buttons: [
                { render_data: { label: '🍕今天吃什么', style: 1 }, action: { type: 2, permission: { type: 2 }, data: '/今天吃什么' } },
                { render_data: { label: '🧋今天喝什么', style: 1 }, action: { type: 2, permission: { type: 2 }, data: '/今天喝什么' } },
              ],
            },
            {
              buttons: [
                { render_data: { label: '📋菜单', style: 1 }, action: { type: 2, permission: { type: 2 }, data: '/菜单' } },
              ],
            },
          ],
        },
      },
    }

    const bot = session.bot as any
    if (session.isDirect) {
      await bot.internal.sendPrivateMessage(channelId, payload)
    } else {
      await bot.internal.sendMessage(channelId, payload)
    }
  }

  ctx.command('eat', '今天吃什么')
    .alias('今天吃什么')
    .alias('吃什么')
    .alias('今天吃啥')
    .alias('吃啥')
    .action(async ({ session }) => {
      if (!foods.length) return '食物列表为空，请检查数据文件'
      const choice = foods[Math.floor(Math.random() * foods.length)]
      let msg = `## 今天吃什么呢？\n爱丽丝推荐老师吃：\n✨**${choice}**✨`
      if (config.text?.length) msg += '\n' + config.text.map(t => `**${t}**`).join('\n')
      await sendMarkdown(session, msg)
    })

  ctx.command('drink', '今天喝什么')
    .alias('今天喝什么')
    .alias('喝什么')
    .alias('今天喝啥')
    .alias('喝啥')
    .action(async ({ session }) => {
      if (!drinks.length) return '饮品列表为空，请检查数据文件'
      const choice = drinks[Math.floor(Math.random() * drinks.length)]
      let msg = `## 今天喝什么呢？\n爱丽丝推荐老师喝：\n✨**${choice}**✨`
      if (config.text?.length) msg += '\n' + config.text.map(t => `**${t}**`).join('\n')
      await sendMarkdown(session, msg)
    })
}
