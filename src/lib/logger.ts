/**
 * Structured logging utility
 * Provides consistent logging across the application with different log levels
 * and proper formatting for development and production environments.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isClient = typeof window !== 'undefined'

  /**
   * Format timestamp in ISO string
   */
  private getTimestamp(): string {
    return new Date().toISOString()
  }

  /**
   * Create a structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
  ): LogEntry {
    return {
      timestamp: this.getTimestamp(),
      level,
      message,
      context,
      error,
    }
  }

  /**
   * Output log entry to console with appropriate formatting
   */
  private output(entry: LogEntry): void {
    const { timestamp, level, message, context, error } = entry

    // In development, use enhanced console formatting
    if (this.isDevelopment) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️', 
        error: '❌',
      }[level]

      const color = {
        debug: 'color: #6B7280',
        info: 'color: #3B82F6',
        warn: 'color: #F59E0B',
        error: 'color: #EF4444',
      }[level]

      console.groupCollapsed(
        `%c${emoji} [${level.toUpperCase()}] ${message}`,
        color,
      )

      if (context) {
        console.log('Context:', context)
      }

      if (error) {
        console.error('Error:', error)
      }

      console.log('Timestamp:', timestamp)
      console.groupEnd()
    } else {
      // In production, use structured JSON logging
      const logData = JSON.stringify(entry)
      console.log(logData)

      // In production, also send to external logging service
      this.sendToLoggingService(entry)
    }
  }

  /**
   * Send logs to external logging service in production
   */
  private sendToLoggingService(entry: LogEntry): void {
    // Only in production and client-side
    if (!this.isDevelopment && this.isClient) {
      // TODO: Integrate with logging service (DataDog, LogRocket, etc.)
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // }).catch(() => {
      //   // Silently fail - don't log errors about logging
      // })
    }
  }

  /**
   * Debug level logging - only shown in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.output(this.createLogEntry('debug', message, context))
    }
  }

  /**
   * Info level logging - general information
   */
  info(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('info', message, context))
  }

  /**
   * Warning level logging - potential issues
   */
  warn(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('warn', message, context))
  }

  /**
   * Error level logging - errors and exceptions
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.output(this.createLogEntry('error', message, context, error))
  }

  /**
   * Time a function execution
   */
  time<T>(label: string, fn: () => T): T {
    const start = performance.now()
    try {
      const result = fn()
      const duration = performance.now() - start
      this.debug(`${label} completed`, { duration: `${duration.toFixed(2)}ms` })
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.error(`${label} failed`, error as Error, { duration: `${duration.toFixed(2)}ms` })
      throw error
    }
  }

  /**
   * Time an async function execution
   */
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.debug(`${label} completed`, { duration: `${duration.toFixed(2)}ms` })
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.error(`${label} failed`, error as Error, { duration: `${duration.toFixed(2)}ms` })
      throw error
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export specific loggers for different modules
export const authLogger = {
  debug: (message: string, context?: LogContext) => logger.debug(`[AUTH] ${message}`, context),
  info: (message: string, context?: LogContext) => logger.info(`[AUTH] ${message}`, context),
  warn: (message: string, context?: LogContext) => logger.warn(`[AUTH] ${message}`, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(`[AUTH] ${message}`, error, context),
}

export const apiLogger = {
  debug: (message: string, context?: LogContext) => logger.debug(`[API] ${message}`, context),
  info: (message: string, context?: LogContext) => logger.info(`[API] ${message}`, context),
  warn: (message: string, context?: LogContext) => logger.warn(`[API] ${message}`, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(`[API] ${message}`, error, context),
}

export const dashboardLogger = {
  debug: (message: string, context?: LogContext) => logger.debug(`[DASHBOARD] ${message}`, context),
  info: (message: string, context?: LogContext) => logger.info(`[DASHBOARD] ${message}`, context),
  warn: (message: string, context?: LogContext) => logger.warn(`[DASHBOARD] ${message}`, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(`[DASHBOARD] ${message}`, error, context),
} 